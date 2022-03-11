import DataManager from "./DataManager"
import { getWebSocket, WSServerClient } from "../realtime/websocket/WSServerClient"
import PacketHandler from "../realtime/protocol/listener/PacketHandler"
import WSPSFeedPostCreated from "../realtime/protocol/v1/packets/server/WSPSFeedPostCreated"
import { getFeedPost } from "../data/feed"
import { Post } from "../data/post/types"

export default class FeedsManager extends DataManager<ManagerPost> {

    private static PAGE_SIZE = 10

    lastLoadId = Math.round(Math.random() * 10_000_000)

    constructor(wsServerClient: WSServerClient) {
        super("feeds", ["id", "feedId", "pinned", "lastLoadId", "loadedFeed"], wsServerClient)
    }

    protected async initData() {
        this.maxIdByPage = {}
        this.lastLoadId = Math.round(Math.random() * 10_000_000)
    }

    private async _waitFetching() {
        if (this._fetching)
            await new Promise<void>(executor => this._waitingForFetchEnd.push(executor))
    }

    private initFeedData(feed: FeedId){
        this.loadPage(feed, 0)
    }

    private maxIdByPage: {[key: number]: number} = {}

    public getFeedNotifications(feed: FeedId, page: number, limit: number){
        return this.getTable().where({ "loadedFeed": feed ?? mainFeedId }).limit(limit)
    }

    public async loadPage(feed: FeedId, page: number) {
        await this._waitFetching()
        
        const posts = (await getFeedPost(feed, page)).data

        FeedsManager.PAGE_SIZE = posts.size

        // Update lastLoadId
        const content = posts.content.map(post => ({
            ...post,
             lastLoadId: this.lastLoadId,
             loadedFeed: feed ?? mainFeedId,
        } as ManagerPost));

        this.addBulkData(content)

        const maxId = posts.content.reduce((prev, post) => Math.max(prev, post.id), 0)
        const lastId = posts.content.reduce((prev, post) => Math.min(prev, post.id), Number.MAX_SAFE_INTEGER)
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

        return posts.last
    }

    private async getFeedPosts(feed: FeedId){
        return this.getTable().where("loadedFeed").equals(feed ?? mainFeedId).toArray()
    }

    private async setFeedLastId(feed: FeedId, lastId: number){
        await this.setContext(`last:${feed}`, { lastId })
    }
    private async getFeedLastId(feed: FeedId){
        return (await this.getContext(`last:${feed}`)).lastId as number | undefined
    }


    public async loadMore(feed: number | undefined, minId: number) {
        await this._waitFetching()
        // return await this.loadPage(feed, Math.floor(await this.getTable().where("id").aboveOrEqual(minId).count() / await this.getResultsByPage()))
    }

    protected async isAnyInCache(ids: number[]): Promise<boolean> {
        return !!(await this.getTable().where("id").anyOf(ids).first())
    }
    private async isAnyOfFeedInCache(feed: FeedId, ids: number[]){
        return !!(await this.getTable().where("loadedFeed").equals(feed ?? mainFeedId).and(post => ids.includes(post.id)).first())
    }
    private async checkUnloaded(feed: FeedId, minId: number, maxId: number){
        const posts = (await this.getTable().where(["loadedFeed", "id"]).between([feed ?? mainFeedId, minId], [feed ?? mainFeedId, maxId], true, true).toArray()).sort((a, b) => a.id - b.id)
        
        const toUnload: ManagerPost[] = []
        let toUnloadTemp: ManagerPost[] = []

        let freshBefore = false;
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
        await this.getTable().bulkDelete(toUnload.map(post => post.id))
    }

    public isFresh(post: ManagerPost){
        return post.lastLoadId == this.lastLoadId
    }

    @PacketHandler(WSPSFeedPostCreated)
    private async handleFeedPostCreated(packet: WSPSFeedPostCreated){
        this.addData({
            ...packet.post,
            lastLoadId: this.lastLoadId,
            loadedFeed: packet.post.feedId
        } as ManagerPost)

        if(packet.follow){
            this.addData({
                ...packet.post,
                lastLoadId: this.lastLoadId,
                loadedFeed: mainFeedId
            } as ManagerPost)
        }
    }

}
let feedsManager = new FeedsManager(undefined!)

window.addEventListener("logged", () => (feedsManager = new FeedsManager(getWebSocket())).init())

export { feedsManager }

type ManagerPost = { lastLoadId: number, loadedFeed: number } & Post
type FeedId = number | undefined
const mainFeedId = -1