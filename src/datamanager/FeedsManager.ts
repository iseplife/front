import DataManager from "./DataManager"
import { getWebSocket, WSServerClient } from "../realtime/websocket/WSServerClient"
import PacketHandler from "../realtime/protocol/listener/PacketHandler"
import WSPSFeedPostCreated from "../realtime/protocol/v1/packets/server/WSPSFeedPostCreated"
import { getFeedPost, getFeedPostsBefore } from "../data/feed"
import { Post, PostUpdate } from "../data/post/types"
import { Page } from "../data/request.type"
import { isBefore } from "date-fns"

export default class FeedsManager extends DataManager<ManagerPost> {

    private static baseDateMs = 1615849200000// Wed Mar 16 2021 00:00:00 GMT+0100

    public static PAGE_SIZE = 8

    lastLoadId = Math.round(Math.random() * 10_000_000)

    private loadedFeeds = new Set<FeedId>()

    constructor(wsServerClient: WSServerClient) {
        super("feeds", ["[loadedFeed+publicationDateId]", "loadedFeed", "id", "feedId", "[loadedFeed+lastLoadId]", "[lastLoadId+loadedFeed+publicationDateId]"], wsServerClient)
        this.setContext("no_connection", { bugged: new Set() })
    }

    protected async initData() {
        this.maxIdByPage = {}
        this.lastLoadId = Math.round(Math.random() * 10_000_000)
        for(const loaded of this.loadedFeeds)
            this.initFeedData(loaded)
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

    private maxIdByPage: {[key: number]: number} = {}

    public countFreshFeedPosts(feed: FeedId){
        return this.getTable().where(["loadedFeed", "lastLoadId"]).equals([feed ?? mainFeedId, this.lastLoadId]).count()
    }
    public async countFreshPostsAfter(feed: FeedId, publicationDateId: number) {
        return this.getTable().where(["loadedFeed", "publicationDateId"]).between([feed ?? mainFeedId, publicationDateId], [feed ?? mainFeedId, this.calcIdFromDateId(new Date(), 999_999)]).count()
    }
    public async getLastPostedFresh(feed: FeedId) {
        return this.getTable().where(["lastLoadId", "loadedFeed", "publicationDateId"]).between([this.lastLoadId, feed ?? mainFeedId, 0], [this.lastLoadId, feed ?? mainFeedId, this.calcIdFromDateId(new Date(), 999_999)]).last()
    }
    public async getFirstPostedFresh(feed: FeedId) {
        return this.getTable().where(["loadedFeed", "lastLoadId"]).equals([feed ?? mainFeedId, this.lastLoadId]).first()
    }
    public getFeedPosts(feed: FeedId, limit: number){
        return this.getTable().where({ "loadedFeed": feed ?? mainFeedId }).reverse().limit(limit).toArray()
    }

    public async loadMore(feed: FeedId){
        await this._waitFetching()
        const firstFresh = await this.getFirstPostedFresh(feed)
        return await this.loadBefore(feed, firstFresh?.publicationDate ?? undefined)
    }

    public async subscribe(feed: FeedId){
        this.loadedFeeds.add(feed)
    }
    public async unsubscribe(feed: FeedId){
        this.loadedFeeds.delete(feed)
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
            lastLoadId: this.lastLoadId,
            loadedFeed: feed ?? mainFeedId,
            publicationDateId: this.calcId(post),
        } as ManagerPost))

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
            const fresh = this.isFresh(post)
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
        await this.getTable().bulkDelete(toUnload.map(post => post.publicationDateId))
    }

    public isFresh(post: ManagerPost){
        return post.lastLoadId == this.lastLoadId
    }

    @PacketHandler(WSPSFeedPostCreated)
    private async handleFeedPostCreated(packet: WSPSFeedPostCreated){
        packet.post.publicationDate = new Date(packet.post.publicationDate)

        const publicationDateId = this.calcId(packet.post)

        this.addData({
            ...packet.post,
            lastLoadId: this.lastLoadId,
            loadedFeed: packet.post.feedId,
            publicationDateId,
        } as ManagerPost)

        if(packet.follow){
            this.addData({
                ...packet.post,
                lastLoadId: this.lastLoadId,
                loadedFeed: mainFeedId,
                publicationDateId,
            } as ManagerPost)
        }
    }

}
let feedsManager = new FeedsManager(undefined!)

window.addEventListener("logged", () => (feedsManager = new FeedsManager(getWebSocket())).init())

export { feedsManager }

type ManagerPost = { lastLoadId: number, loadedFeed: number, publicationDateId: number } & Post
type FeedId = number | undefined
const mainFeedId = 0