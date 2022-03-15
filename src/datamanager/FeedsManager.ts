import DataManager from "./DataManager"
import { getWebSocket, WSServerClient } from "../realtime/websocket/WSServerClient"
import PacketHandler from "../realtime/protocol/listener/PacketHandler"
import WSPSFeedPostCreated from "../realtime/protocol/v1/packets/server/WSPSFeedPostCreated"
import { getFeedPost } from "../data/feed"
import { Post, PostUpdate } from "../data/post/types"
import { Page } from "../data/request.type"

export default class FeedsManager extends DataManager<ManagerPost> {

    public static PAGE_SIZE = 10

    lastLoadId = Math.round(Math.random() * 10_000_000)

    private loadedFeeds = new Set<FeedId>()

    constructor(wsServerClient: WSServerClient) {
        super("feeds", ["publicationDateId", "id", "feedId", "lastLoadId", "loadedFeed", "[publicationDateId+loadedFeed]"], wsServerClient)
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
        this.loadPage(feed, 0)
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

    public getFeedPosts(feed: FeedId, limit: number){
        return this.getTable().where({ "loadedFeed": feed ?? mainFeedId }).reverse().limit(limit).toArray()
    }

    public async loadMore(feed: FeedId, lastLoadedCustomId: number){
        await this._waitFetching()
        const count = await this.getTable().where(["publicationDateId", "loadedFeed"]).between([lastLoadedCustomId, feed ?? mainFeedId], [Number.MAX_VALUE, feed ?? mainFeedId]).count()
        const page = Math.floor(count / FeedsManager.PAGE_SIZE)
        return await this.loadPage(feed, page)
    }

    public async subscribe(feed: FeedId){
        this.loadedFeeds.add(feed)
    }
    public async unsubscribe(feed: FeedId){
        this.loadedFeeds.delete(feed)
    }

    public async loadPage(feed: FeedId, page: number): Promise<[boolean, number]> {
        await this._waitFetching()
        let posts: Page<Post>
        try{
            posts = (await getFeedPost(feed, page)).data
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

        const maxId = content.reduce((prev, post) => Math.max(prev, post.publicationDateId), 0)
        const lastId = content.reduce((prev, post) => Math.min(prev, post.publicationDateId), Number.MAX_VALUE)
        this.maxIdByPage[page] = maxId

        if(posts.last)
            this.setFeedLastId(feed, lastId)

        // Remove deleted
        if(this.maxIdByPage[page - 2])
            this.checkUnloaded(feed, lastId, this.maxIdByPage[page - 2])
        else if(this.maxIdByPage[page - 1])
            this.checkUnloaded(feed, lastId, this.maxIdByPage[page - 1])
        else
            this.checkUnloaded(feed, lastId, maxId)

        return [posts.last, maxId]
    }

    private calcId(post: Post | PostUpdate){
        return +(post.publicationDate.getTime().toString() + post.id)
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

    private async checkUnloaded(feed: FeedId, minCustomId: number, maxCustomId: number){
        const posts = (await this.getTable().where(["publicationDateId", "loadedFeed"]).between([minCustomId, feed ?? mainFeedId], [maxCustomId, feed ?? mainFeedId], true, true).toArray()).sort((a, b) => a.id - b.id)
        
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
        console.log("Unload posts:", toUnload)
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
const mainFeedId = -1