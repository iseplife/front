import DataManager from "./DataManager"
import {getWebSocket, WSServerClient} from "../realtime/websocket/WSServerClient"
import PacketHandler from "../realtime/protocol/listener/PacketHandler"
import {getFeedPosts, getFeedPostsBefore} from "../data/feed"
import {BasicPostCreation, Embed, Post, PostCreation, PostUpdate, PostUpdateForm} from "../data/post/types"
import {Page} from "../data/request.type"
import {addMonths, isBefore} from "date-fns"
import {createPost, deletePost, updatePost} from "../data/post"
import GeneralEventType from "../constants/GeneralEventType"
import WSPSFeedPostEdited from "../realtime/protocol/packets/server/WSPSFeedPostEdited"
import WSPSFeedPostLikesUpdate from "../realtime/protocol/packets/server/WSPSFeedPostLikesUpdate"
import WSPSFeedPostRemoved from "../realtime/protocol/packets/server/WSPSFeedPostRemoved"
import WSPSFeedPostCreated from "../realtime/protocol/packets/server/WSPSFeedPostCreated"
import { BroadcastChannel } from "broadcast-channel"
import WSPSFeedPostCommentsUpdate from "../realtime/protocol/packets/server/WSPSFeedPostCommentsUpdate"
import WSPSFeedPostPollChoiceUpdate from "../realtime/protocol/packets/server/WSPSFeedPostPollChoiceUpdate"
import { Poll } from "../data/poll/types"

type FeedsChannelMessage = {
    type: "ask"
    id: number
    pageId: number
    reloading: boolean
    reloadingId: number
} | {
    type: "response"
    id: number
    pageId: number
    doNotRenew: boolean
    reloading: boolean
} | {
    type: "update"
    feedId: number
    lastLoadId: number
} | {
    type: "lastLoadAll"
    id: number
    feeds: {
        feedId: number
        lastLoadId: number
    }[]
} | {
    type: "askLastLoadAll"
    id: number
    targettedPageId: number
}

const pageId = Math.random()

export default class FeedsManager extends DataManager<ManagerPost> {

    private reloading = false

    private initLoadSyncWait?: Promise<void>

    private reloadingPriorityId = Math.random()

    private static baseDateMs = 1615849200000// Wed Mar 16 2021 00:00:00 GMT+0100

    public static PAGE_SIZE = 8

    lastLoadIdByFeed: { [key: number]: number } = {}

    private loadedFeeds = new Set<FeedId>()

    private channel = new BroadcastChannel<FeedsChannelMessage>("feeds-manager", { webWorkerSupport: false })

    private globalChannelHandler!: (msg: FeedsChannelMessage) => void

    constructor(wsServerClient: WSServerClient) {
        super("feeds", ["[loadedFeed+publicationDateId]", "[loadedFeed+waitingForUpdate]", "publicationDate", "loadedFeed", "thread", "id", "[loadedFeed+lastLoadId]", "[lastLoadId+loadedFeed+publicationDateId]", "[loadedFeed+id]"], wsServerClient)
        this.setContext("no_connection", { bugged: new Set() })
        if(wsServerClient){
            this.channel.addEventListener("message", this.globalChannelHandler = message => {
                if (message.type == "ask" && message.pageId != pageId && getWebSocket()?.connected) {
                    if (!this.reloading || message.reloadingId <= this.reloadingPriorityId) {
                        this.channel.postMessage({
                            type: "response",
                            id: message.id,
                            doNotRenew: true,
                            pageId,
                            reloading: this.reloading,
                        })
                    }
                } else if (message.type == "update" && message.lastLoadId)
                    this.lastLoadIdByFeed[message.feedId] = message.lastLoadId
                else if (message.type == "askLastLoadAll" && message.targettedPageId == pageId) {
                    this.channel.postMessage({
                        type: "lastLoadAll",
                        id: message.id,
                        feeds: Object.entries(this.lastLoadIdByFeed).map(entry => ({ feedId: +entry[0], lastLoadId: entry[1] }))
                    })
                }
            })
        }else
            this.channel.close()
       
    }

    protected async initData(reconnect?: boolean) {
        this.reloading = !!reconnect
        let now = Date.now()
        let lastLoadLoaded = false
        await (this.initLoadSyncWait = new Promise<void>(resolve => {
            let responded = false
            const id = Math.random()
            console.time("ask")
            const handler = async (message: FeedsChannelMessage) => {
                if (message.type == "response" && message.id == id
                || (message.type == "ask" && message.id != id && message.reloadingId != this.reloadingPriorityId && message.reloadingId > this.reloadingPriorityId)) {
                    console.timeEnd("ask")
                    responded = true
                    this.channel.removeEventListener("message", handler)

                    if (!("doNotRenew" in message) || message.doNotRenew) {
                        now = await this.getGeneralLastLoad() ?? 0
                        
                        const handler2 = async (message: FeedsChannelMessage) => {
                            if (message.type == "lastLoadAll" && message.id == pageId) {
                                this.channel.removeEventListener("message", handler2)
                                lastLoadLoaded = true
                                for (const entry of message.feeds)
                                    this.lastLoadIdByFeed[entry.feedId] = entry.lastLoadId
                                resolve()
                            }
                        }
                        this.channel.addEventListener("message", handler2)
                        this.channel.postMessage({
                            type: "askLastLoadAll",
                            id: pageId,
                            targettedPageId: message.pageId,
                        })

                        setTimeout(() => {
                            if (!lastLoadLoaded) {
                                this.channel.removeEventListener("message", handler2)
                                resolve()
                            }
                        }, reconnect ? 200 : 170)
                    }
                }
            }
            this.channel.addEventListener("message", handler)
            this.channel.postMessage({
                type: "ask",
                id,
                pageId,
                reloading: this.reloading,
                reloadingId: this.reloadingPriorityId
            })

            setTimeout(() => {
                if (!responded) {
                    console.timeEnd("ask")
                    this.channel.removeEventListener("message", handler)
                    resolve()
                }
            }, reconnect ? 200 : 170)
        }))

        this.initLoadSyncWait = undefined
        this.reloading = false

        if(!lastLoadLoaded)
            for (const feedId in this.lastLoadIdByFeed)
                if (!this.loadedFeeds.has(+feedId))
                    this.lastLoadIdByFeed[feedId] = now
        
        this.setContext("lastLoad", {lastLoad: now})

        this.getTable()
            .where("publicationDate")
            .below(addMonths(new Date(), -4))
            .delete()
            .then(deleted => console.debug("[Feed] deleted", deleted, "old posts"))

    }

    public fullReloadFromOtherTabs(feedId: FeedId, callback: () => void) {
        const fnc = (message: FeedsChannelMessage) => {
            if (message.type == "update" && message.feedId == (feedId ?? mainFeedId))
                callback()
        }
        this.channel.addEventListener("message", fnc)

        return () => this.channel.removeEventListener("message", fnc)
    }

    private async _waitFetching() {
        if (this._fetching)
            await new Promise<void>(executor => this._waitingForFetchEnd.push(executor))
    }

    private initFeedData(feed: FeedId) {
        this.loadBefore(feed)
    }

    public async isWithoutConnection(feed: FeedId) {
        return ((await this.getContext("no_connection")).bugged as Set<FeedId>).has(feed ?? mainFeedId)
    }

    public async setWithoutConnection(feed: FeedId, error: boolean) {
        const bugged = (await this.getContext("no_connection")).bugged as Set<FeedId>
        const before = bugged.size

        if (error)
            bugged.add(feed ?? mainFeedId)
        else
            bugged.delete(feed ?? mainFeedId)

        if (bugged.size != before)
            await this.setContext("no_connection", {bugged})
    }

    public countFreshFeedPosts(feed: FeedId) {
        return this.getTable().where(["loadedFeed", "lastLoadId"]).between([feed ?? mainFeedId, this.getLastLoad(feed)], [feed ?? mainFeedId, Infinity]).count()
    }

    public async countFreshPostsAfter(feed: FeedId, publicationDateId: number) {
        return this.getTable().where(["loadedFeed", "publicationDateId"]).between([feed ?? mainFeedId, publicationDateId], [feed ?? mainFeedId, this.calcIdFromDateId(new Date(), 999_999)]).count()
    }

    public async getLastPostedFresh(feed: FeedId) {
        return this.getTable().where(["lastLoadId", "loadedFeed", "publicationDateId"]).between([this.getLastLoad(feed), feed ?? mainFeedId, 0], [this.getLastLoad(feed), feed ?? mainFeedId, this.calcIdFromDateId(new Date(), 999_999)]).last()
    }

    public async getFirstPostedFresh(feed: FeedId) {
        return this.getTable().where(["loadedFeed", "lastLoadId"]).between([feed ?? mainFeedId, this.getLastLoad(feed)], [feed ?? mainFeedId, Infinity]).first()
    }

    public getFeedPosts(feed: FeedId, limit: number) {
        return this.getTable().where({"loadedFeed": feed ?? mainFeedId}).reverse().limit(limit).toArray()
    }
    public getFeedPost(feed: FeedId, postId: number) {
        return this.getTable().where({"loadedFeed": feed ?? mainFeedId, "id": postId}).first()
    }

    public async loadMore(feed: FeedId) {
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

    public async subscribe(feed: FeedId, fullReload?: boolean) {
        this.loadedFeeds.add(feed ?? mainFeedId)
        const postsToDelete = [] as ManagerPost[]
        const postsToAdd = [] as ManagerPost[]

        this.getTable().where({
            "loadedFeed": feed ?? mainFeedId,
            "waitingForUpdate": "true"
        }).toArray().then(posts => posts.forEach(post => {
            if (post.waitFor?.delete)
                postsToDelete.push(post)
            else if (post.waitFor?.modif)
                postsToAdd.push({
                    ...post,
                    ...post.waitFor.modif,
                    waitingForUpdate: false,
                })
        }))


        this.getTable().bulkDelete(postsToDelete.map(post => [post.loadedFeed, post.publicationDateId]))
        this.addBulkData(postsToAdd)

        await this.initLoadSyncWait

        const lastLoad = this.lastLoadIdByFeed[feed ?? mainFeedId] = Math.max(this.lastLoadIdByFeed[feed ?? mainFeedId] ?? 0, (await this.getGeneralLastLoad()))
        
        this.channel.postMessage({
            type: "update",
            feedId: feed ?? mainFeedId,
            lastLoadId: lastLoad
        })
        return lastLoad
    }

    public async unsubscribe(feed: FeedId) {
        this.loadedFeeds.delete(feed ?? mainFeedId)
    }

    public async loadBefore(feed: FeedId, lastLoadedDate?: Date): Promise<[boolean, number, number]> {
        await this._waitFetching()
        let posts: Page<Post>
        try {
            posts = (await (lastLoadedDate ? getFeedPostsBefore(feed, lastLoadedDate.getTime()) : getFeedPosts(feed, 0))).data
        } catch (e) {
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
                console.debug("deleted", deleted, "removed posts")
        }

        this.addBulkData(content)

        const lastId = content.reduce((prev, post) => Math.min(prev, post.publicationDateId), Number.MAX_VALUE)

        if (posts.last)
            this.setFeedLastId(feed, lastId)

        this.checkUnloaded(feed)

        return [
            posts.last,
            content.reduce((prev, post) => isBefore(post.publicationDate, new Date()) ? Math.min(prev, post.publicationDateId) : prev, Infinity),
            content.reduce((prev, post) => isBefore(post.publicationDate, new Date()) ? Math.max(prev, post.publicationDateId) : prev, 0),
        ]
    }

    // REWORK LOAD AFTER RECONNECT

    public calcId(post: Post | PostUpdate) {
        return this.calcIdFromDateId(post.publicationDate, post.id)
    }

    private calcIdFromDateId(date: Date, _id: number) {
        let id = _id.toString()
        while (id.length < 6)
            id = "0" + id
        return +(Math.floor((date.getTime() - FeedsManager.baseDateMs) / 10_000).toString() + id)
    }

    private async getAllFeedPosts(feed: FeedId) {
        return this.getTable().where("loadedFeed").equals(feed ?? mainFeedId).toArray()
    }

    private async setFeedLastId(feed: FeedId, lastId: number) {
        await this.setContext(`last:${feed}`, {lastId})
    }

    public async getFeedLastId(feed: FeedId) {
        return (await this.getContext(`last:${feed}`)).lastId as number | undefined
    }

    private async checkUnloaded(feed: FeedId) {
        const posts = (await this.getTable()
            .where(["loadedFeed", "publicationDateId"])
            .between(
                [feed ?? mainFeedId, (await this.getFirstPostedFresh(feed))?.publicationDateId],
                [feed ?? mainFeedId, Infinity]
            ).toArray())
            .sort((a, b) => a.id - b.id)

        const toUnload: ManagerPost[] = []
        let toUnloadTemp: ManagerPost[] = []

        let freshBefore = false
        //De l'id - au +
        for (const post of posts) {
            const fresh = this.isFresh(post, feed)
            if (fresh) {
                if (freshBefore) {
                    toUnload.push(...toUnloadTemp)
                    toUnloadTemp = []
                }
                freshBefore = true
            } else
                toUnloadTemp.push(post)
        }
        console.debug("Unload posts:", feed, toUnload)
        await this.getTable().bulkDelete(toUnload.map(post => [post.loadedFeed, post.publicationDateId]))
    }

    public isFresh(post: ManagerPost, feed: FeedId) {
        return post.lastLoadId >= this.getLastLoad(feed)
    }

    @PacketHandler(WSPSFeedPostCreated)
    private async handleFeedPostCreated(packet: WSPSFeedPostCreated) {
        packet.post.publicationDate = new Date(packet.post.publicationDate)

        this.addPostToFeed(packet.post, packet.post.context.feedId, packet.hasWriteAccess)
        if (packet.follow) {
            this.addData({
                ...packet.post,
                lastLoadId: this.getLastLoad(undefined),
                loadedFeed: mainFeedId,
                hasWriteAccess: packet.hasWriteAccess,
                publicationDateId: this.calcId(packet.post),
                waitingForUpdate: false,
                waitFor: undefined!,
            })
        }
    }

    public async addPostToFeed(post: PostUpdate | Post, feed: FeedId, hasWriteAccess?: boolean) {
        await this.addData({
            ...post,
            lastLoadId: this.getLastLoad(feed),
            loadedFeed: feed ?? mainFeedId,
            hasWriteAccess: hasWriteAccess ?? (post as Post).hasWriteAccess,
            publicationDateId: this.calcId(post),
        } as ManagerPost)
    }

    public async removePostFromLoadedFeed(publicationDateId: number, loadedFeed: FeedId) {
        const detected = (await this.getTable().where({
            loadedFeed: loadedFeed ?? mainFeedId,
            publicationDateId
        }).toArray()).map(post => [post.loadedFeed, post.publicationDateId])
        await this.getTable().bulkDelete(detected)
    }

    public async removePost(id: number) {
        await this.getTable().bulkDelete((await this.getTable().where("id").equals(id).toArray()).map(post => [post.loadedFeed, post.publicationDateId]))
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
        if (toUpdate.length)
            this.addBulkData(toUpdate)
    }

    @PacketHandler(WSPSFeedPostLikesUpdate)
    private async handleFeedPostLikesUpdate(packet: WSPSFeedPostLikesUpdate) {
        (await this.getTable().where("thread").equals(packet.threadID).toArray())
            .forEach(post =>
                this.getTable().update([post.loadedFeed, post.publicationDateId], {nbLikes: packet.likes})
            )
    }
    @PacketHandler(WSPSFeedPostCommentsUpdate)
    private async handleFeedPostCommentsUpdate(packet: WSPSFeedPostCommentsUpdate) {
        (await this.getTable().where("thread").equals(packet.threadID).toArray())
            .forEach(post =>
                this.getTable().update([post.loadedFeed, post.publicationDateId], {nbComments: packet.comments})
            )
    }
    @PacketHandler(WSPSFeedPostPollChoiceUpdate)
    private async handleFeedPostPollChoiceUpdate(packet: WSPSFeedPostPollChoiceUpdate) {
        (await this.getTable().where("id").equals(packet.postId).toArray())
            .forEach(post => {
                const poll = (post.embed as Poll)
                packet.choices.forEach(choice => poll.choices.find(other => other.id == choice.id)!.votesNumber = choice.votes)
                this.getTable().update([post.loadedFeed, post.publicationDateId], { "embed.choices": poll.choices })
            })
    }

    public async updateEmbed(postId: number, embed: Embed) {
        (await this.getTable().where("id").equals(postId).toArray())
            .forEach(post =>
                this.getTable().update([post.loadedFeed, post.publicationDateId], { embed })
            )
    }

    public async createPost(post: BasicPostCreation | PostCreation) {
        return await createPost(post)
    }

    public async editPost(id: number, postUpdate: PostUpdateForm) {
        const res = await updatePost(id, postUpdate)
        if (res.status === 200) {
            for (const post of await this.getTable().where("id").equals(id).toArray())
                this.addData({
                    ...post,
                    ...res.data,
                    waitingForUpdate: false,
                })
        } else
            throw new Error("No connection")

        return res.data
    }

    public async deletePost(id: number) {
        if ((await deletePost(id)).status == 200)
            await this.getTable().bulkDelete((await this.getTable().where("id").equals(id).toArray()).map(post => [post.loadedFeed, post.publicationDateId]))
        else
            throw new Error("No connection")
    }

    public async applyUpdates(id: number) {
        const postsToDelete = [] as ManagerPost[]
        const postsToAdd = [] as ManagerPost[]
        for (const post of (await this.getTable().where("id").equals(id).toArray())) {
            if (post.waitFor?.delete)
                postsToDelete.push(post)
            else if (post.waitFor?.modif)
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
    public async updatePost(id: number, update: Partial<Post>) {
        const postsToAdd = []
        for (const post of (await this.getTable().where("id").equals(id).toArray()))
            postsToAdd.push({
                ...post,
                ...update,
            })
        await this.addBulkData(postsToAdd)
    }

    public outdateFeed(feed: FeedId) {
        this.lastLoadIdByFeed[feed ?? mainFeedId] = Date.now()
    }

    public async _unregister() {
        this.channel.removeEventListener("message", this.globalChannelHandler)
        this.channel.close()
        super.unregister()
    }

}
let feedsManager = new FeedsManager(undefined!)

window.addEventListener(GeneralEventType.LOGGED, () => (feedsManager = new FeedsManager(getWebSocket())).init())

export {feedsManager}

export type ManagerPost = {
    lastLoadId: number,
    loadedFeed: number,
    publicationDateId: number,
    waitingForUpdate: "true" | false,
    waitFor: {
        delete?: boolean,
        modif?: PostUpdate
    }
} & Post
type FeedId = number | undefined
const mainFeedId = 0
