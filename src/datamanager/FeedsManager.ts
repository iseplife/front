import DataManager from "./DataManager"
import { getWebSocket, WSServerClient } from "../realtime/websocket/WSServerClient"
import PacketHandler from "../realtime/protocol/listener/PacketHandler"
import WSPSFeedPostCreated from "../realtime/protocol/v1/packets/server/WSPSFeedPostCreated"
import { getFeedPost, getFeedPostsBefore } from "../data/feed"
import { BasicPostCreation, Post, PostCreation, PostUpdate, PostUpdateForm } from "../data/post/types"
import { Page } from "../data/request.type"
import { addMonths, isBefore } from "date-fns"
import { createPost, deletePost, updatePost } from "../data/post"
import WSPSFeedPostRemoved from "../realtime/protocol/v1/packets/server/WSPSFeedPostRemoved"
import WSPSFeedPostEdited from "../realtime/protocol/v1/packets/server/WSPSFeedPostEdited"
import WSPSFeedPostLikesUpdate from "../realtime/protocol/v1/packets/server/WSPSFeedPostLikesUpdate"

export default class FeedsManager extends DataManager<ManagerPost> {

    private static baseDateMs = 1615849200000// Wed Mar 16 2021 00:00:00 GMT+0100

    public static PAGE_SIZE = 8

    lastLoadIdByFeed: { [key: number]: number } = {}

    private loadedFeeds = new Set<FeedId>()

    constructor(wsServerClient: WSServerClient) {
        super("feeds", ["[loadedFeed+publicationDateId]", "[loadedFeed+waitingForUpdate]", "publicationDate", "loadedFeed", "thread", "id", "[loadedFeed+lastLoadId]", "[lastLoadId+loadedFeed+publicationDateId]"], wsServerClient)
        this.setContext("no_connection", { bugged: new Set() })
    }

    protected async initData() {
        const now = Date.now()

        for (const feedId in this.lastLoadIdByFeed)
            if (!this.loadedFeeds.has(+feedId))
                this.lastLoadIdByFeed[feedId] = now
        
        this.setContext("lastLoad", { lastLoad: now })

        this.getTable().where("publicationDate").below(addMonths(new Date(), -4)).delete().then(deleted => console.log("Deleted", deleted, "old posts"))
    }

    private async _waitFetching() {
        if (this._fetching)
            await new Promise<void>(executor => this._waitingForFetchEnd.push(executor))
    }

    private initFeedData(feed: FeedId){
        this.loadBefore(feed)
    }

    public async isWithoutConnection(feed: FeedId){
        return ((await this.getContext("no_connection")).bugged as Set<FeedId>).has(feed ?? mainFeedId)
    }
    public async setWithoutConnection(feed: FeedId, error: boolean){
        const bugged = (await this.getContext("no_connection")).bugged as Set<FeedId>
        const before = bugged.size

        if(error)
            bugged.add(feed ?? mainFeedId)
        else
            bugged.delete(feed ?? mainFeedId)

        if(bugged.size != before)
            await this.setContext("no_connection", { bugged })
    }

    public countFreshFeedPosts(feed: FeedId){
        return this.getTable().where(["loadedFeed", "lastLoadId"]).equals([feed ?? mainFeedId, this.getLastLoad(feed)]).count()
    }
    public async countFreshPostsAfter(feed: FeedId, publicationDateId: number) {
        return this.getTable().where(["loadedFeed", "publicationDateId"]).between([feed ?? mainFeedId, publicationDateId], [feed ?? mainFeedId, this.calcIdFromDateId(new Date(), 999_999)]).count()
    }
    public async getLastPostedFresh(feed: FeedId) {
        return this.getTable().where(["lastLoadId", "loadedFeed", "publicationDateId"]).between([this.getLastLoad(feed), feed ?? mainFeedId, 0], [this.getLastLoad(feed), feed ?? mainFeedId, this.calcIdFromDateId(new Date(), 999_999)]).last()
    }
    public async getFirstPostedFresh(feed: FeedId) {
        return this.getTable().where(["loadedFeed", "lastLoadId"]).equals([feed ?? mainFeedId, this.getLastLoad(feed)]).first()
    }
    public getFeedPosts(feed: FeedId, limit: number){
        return this.getTable().where({ "loadedFeed": feed ?? mainFeedId }).reverse().limit(limit).toArray()
    }

    public async loadMore(feed: FeedId){
        await this._waitFetching()
        const firstFresh = await this.getFirstPostedFresh(feed)
        return await this.loadBefore(feed, firstFresh?.publicationDate ?? undefined)
    }

    public async getGeneralLastLoad() {
        return (await this.getContext("lastLoad"))?.lastLoad
    }
    public getLastLoad(feed: FeedId): number {
        return this.lastLoadIdByFeed[feed ?? mainFeedId] ?? 0
    }

    public async subscribe(feed: FeedId) {
        const postsToDelete = [] as ManagerPost[]
        const postsToAdd = [] as ManagerPost[]

        for (const post of await this.getTable().where({ "loadedFeed": feed ?? mainFeedId, "waitingForUpdate": "true" }).toArray()) {
            if(post.waitFor?.delete)
                postsToDelete.push(post)
            else if(post.waitFor?.modif)
                postsToAdd.push({
                    ...post,
                    ...post.waitFor.modif,
                    waitingForUpdate: false,
                })
        }
        await Promise.all([
            this.getTable().bulkDelete(postsToDelete.map(post => [post.loadedFeed, post.publicationDateId])),
            this.addBulkData(postsToAdd),
        ])

        this.loadedFeeds.add(feed ?? mainFeedId)
        return this.lastLoadIdByFeed[feed ?? mainFeedId] = (await this.getGeneralLastLoad())
    }
    public async unsubscribe(feed: FeedId){
        this.loadedFeeds.delete(feed ?? mainFeedId)
    }

    public async loadBefore(feed: FeedId, lastLoadedDate?: Date): Promise<[boolean, number, number]> {
        await this._waitFetching()
        let posts: Page<Post>
        try{
            posts = (await (lastLoadedDate ? getFeedPostsBefore(feed, lastLoadedDate.getTime()) : getFeedPost(feed, 0))).data
        }catch(e){
            this.setWithoutConnection(feed, true)
            throw e
        }

        this.setWithoutConnection(feed, false)

        FeedsManager.PAGE_SIZE = posts.size

        // Update lastLoadId
        const content = posts.content.map(post => ({
            ...post,
            lastLoadId: this.getLastLoad(feed),
            loadedFeed: feed ?? mainFeedId,
            publicationDateId: this.calcId(post),
        } as ManagerPost))

        if (!lastLoadedDate) {
            const deleted = await this.getTable().where(["loadedFeed", "publicationDateId"]).between(
                [
                    feed ?? mainFeedId,
                    content.reduce((prev, post) => Math.max(prev, post.publicationDateId), 0) + 1
                ], [
                    feed ?? mainFeedId,
                    Infinity
                ]
            ).delete()
            if (deleted)
                console.log("deleted", deleted, "removed posts")
        }

        this.addBulkData(content)

        const lastId = content.reduce((prev, post) => Math.min(prev, post.publicationDateId), Number.MAX_VALUE)

        if(posts.last)
            this.setFeedLastId(feed, lastId)

        this.checkUnloaded(feed)

        return [
            posts.last,
            content.reduce((prev, post) => isBefore(post.publicationDate, new Date()) ? Math.min(prev, post.publicationDateId) : prev, Infinity),
            content.reduce((prev, post) => isBefore(post.publicationDate, new Date()) ? Math.max(prev, post.publicationDateId) : prev, 0),
        ]
    }

    // REWORK LOAD AFTER RECONNECT

    private calcId(post: Post | PostUpdate) {
        return this.calcIdFromDateId(post.publicationDate, post.id)
    }
    private calcIdFromDateId(date: Date, _id: number) {
        let id = _id.toString()
        while (id.length < 6)
            id = "0" + id
        return +(Math.floor((date.getTime() - FeedsManager.baseDateMs) / 10_000).toString() + id)
    }

    private async getAllFeedPosts(feed: FeedId){
        return this.getTable().where("loadedFeed").equals(feed ?? mainFeedId).toArray()
    }

    private async setFeedLastId(feed: FeedId, lastId: number){
        await this.setContext(`last:${feed}`, { lastId })
    }
    public async getFeedLastId(feed: FeedId){
        return (await this.getContext(`last:${feed}`)).lastId as number | undefined
    }

    private async checkUnloaded(feed: FeedId) {
        const posts = (await this.getTable().where(["loadedFeed", "publicationDateId"]).between([feed ?? mainFeedId, (await this.getFirstPostedFresh(feed))?.publicationDateId], [feed ?? mainFeedId, Infinity]).toArray()).sort((a, b) => a.id - b.id)
        
        const toUnload: ManagerPost[] = []
        let toUnloadTemp: ManagerPost[] = []

        let freshBefore = false
        //De l'id - au +
        for(const post of posts){
            const fresh = this.isFresh(post, feed)
            if(fresh){
                if(freshBefore){
                    toUnload.push(...toUnloadTemp)
                    toUnloadTemp = []
                }
                freshBefore = true
            } else
                toUnloadTemp.push(post)
        }
        console.log("Unload posts:", feed, toUnload)
        await this.getTable().bulkDelete(toUnload.map(post => [post.loadedFeed, post.publicationDateId]))
    }

    public isFresh(post: ManagerPost, feed: FeedId) {
        return post.lastLoadId == this.getLastLoad(feed)
    }

    @PacketHandler(WSPSFeedPostCreated)
    private async handleFeedPostCreated(packet: WSPSFeedPostCreated){
        packet.post.publicationDate = new Date(packet.post.publicationDate)
        
        const publicationDateId = this.calcId(packet.post)

        this.addData({
            ...packet.post,
            lastLoadId: this.getLastLoad(packet.post.feedId),
            loadedFeed: packet.post.feedId,
            hasWriteAccess: packet.hasWriteAccess,
            publicationDateId,
        } as ManagerPost)

        if (packet.follow) {
            this.addData({
                ...packet.post,
                lastLoadId: this.getLastLoad(undefined),
                loadedFeed: mainFeedId,
                hasWriteAccess: packet.hasWriteAccess,
                publicationDateId,
            } as ManagerPost)
        }
    }

    @PacketHandler(WSPSFeedPostRemoved)
    private async handleFeedPostRemoved(packet: WSPSFeedPostRemoved) {
        this.addBulkData(
            (await this.getTable().where("id").equals(packet.id).toArray())
                .map(post => 
                    ({
                        ...post,
                        waitFor: {...post.waitFor, delete: true},
                        waitingForUpdate: "true",
                    })
                )
        )
    }

    @PacketHandler(WSPSFeedPostEdited)
    private async handleFeedPostEdited(packet: WSPSFeedPostEdited) {
        packet.post.publicationDate = new Date(packet.post.publicationDate)

        const toUpdate = 
            (await this.getTable().where("id").equals(packet.post.id).toArray())
                .map(post => 
                    ({
                        ...post,
                        waitFor: {
                            ...post.waitFor,
                            modif: packet.post,
                        },
                        waitingForUpdate: "true",
                    }) as ManagerPost
                )
        if(toUpdate.length)
            this.addBulkData(toUpdate)
    }
    @PacketHandler(WSPSFeedPostLikesUpdate)
    private async handleFeedPostLikesUpdate(packet: WSPSFeedPostLikesUpdate) {
        console.log(packet.likes);
        (await this.getTable().where("thread").equals(packet.threadID).toArray())
            .forEach(post => 
                this.getTable().update([post.loadedFeed, post.publicationDateId], {nbLikes: packet.likes})
            )
    }

    public async createPost(post: BasicPostCreation | PostCreation){
        return await createPost(post)
    }

    public async editPost(id: number, post: PostUpdateForm){
        const res = await updatePost(
            id,
            post
        )
        if(res.status === 200){
            for(const post of await this.getTable().where("id").equals(id).toArray())
                this.addData({
                    ...post,
                    ...res.data,
                })
        }else
            throw new Error("No connection")

        return res.data
    }

    public async deletePost(id: number) {
        if((await deletePost(id)).status == 200)
            await this.getTable().bulkDelete((await this.getTable().where("id").equals(id).toArray()).map(post => [post.loadedFeed, post.publicationDateId]))
        else
            throw new Error("No connection")
    }

    public async applyUpdates(id: number) {
        const postsToDelete = [] as ManagerPost[]
        const postsToAdd = [] as ManagerPost[]
        for(const post of (await this.getTable().where("id").equals(id).toArray())) {
            if(post.waitFor?.delete)
                postsToDelete.push(post)
            else if(post.waitFor?.modif)
                postsToAdd.push({
                    ...post,
                    ...post.waitFor.modif,
                    waitingForUpdate: false,
                    waitFor: undefined!,
                })
        }
        await Promise.all([
            this.getTable().bulkDelete(postsToDelete.map(post => [post.loadedFeed, post.publicationDateId])),
            this.addBulkData(postsToAdd),
        ])
    }

    public outdateMain() {
        this.lastLoadIdByFeed[mainFeedId] = Date.now()
    }

}
let feedsManager = new FeedsManager(undefined!)

window.addEventListener("logged", () => (feedsManager = new FeedsManager(getWebSocket())).init())

export { feedsManager }

export type ManagerPost = { lastLoadId: number, loadedFeed: number, publicationDateId: number, waitingForUpdate: "true" | false, waitFor: {delete?: boolean, modif?: PostUpdate} } & Post
type FeedId = number | undefined
const mainFeedId = 0