import { Notification } from "../data/notification/types"
import DataManager from "./DataManager"
import { getWebSocket, WSServerClient } from "../realtime/websocket/WSServerClient"
import PacketHandler from "../realtime/protocol/listener/PacketHandler"
import WSPSFeedPostCreated from "../realtime/protocol/v1/packets/server/WSPSFeedPostCreated"

export default class FeedsManager extends DataManager<Notification> {

    constructor(wsServerClient: WSServerClient) {
        super("notifications", ["id", "feedId", "pinned", "lastLoadId"], wsServerClient)
    }

    protected async initData() {
        this.initFeedData()
    }

    public async initFeedData(feed?: number){
        await this.loadPage(undefined, 0)
    }

    private async _waitFetching() {
        if (this._fetching)
            await new Promise<void>(executor => this._waitingForFetchEnd.push(executor))
    }

    protected async loadPage(feed: number | undefined, page: number) {
        await this._waitFetching()
            
        if (await this.isLastPage(feed))
            return true
        
        return await this.isLastPage(feed)
    }

    async isLastPage() {
        return await this.getMinFresh(feed) == -1 && await this.didLastPage()
    }

    public async watch(notifications: Notification[]) {
        notifications.forEach(notif => notif.watched = true)
        this.getTable().bulkPut(notifications)
    }

    public async loadMore(feed: number | undefined, minId: number) {
        await this._waitFetching()
        // return await this.loadPage(feed, Math.floor(await this.getTable().where("id").aboveOrEqual(minId).count() / await this.getResultsByPage()))
    }

    public async getNotifications(minId: number): Promise<Notification[]> {
        return this.getTable().where("id").aboveOrEqual(minId).reverse().sortBy("id")
    }
    protected async isAnyInCache(ids: number[]): Promise<boolean> {
        return (await this.getTable().where("id").anyOf(ids).count()) > 0
    }

    @PacketHandler(WSPSFeedPostCreated)
    private async handleFeedPostCreated(packet: WSPSFeedPostCreated){
        this.addData(packet.post)//TODO work
    }

}
let feedsManager = new FeedsManager(undefined!)

window.addEventListener("logged", () => (feedsManager = new FeedsManager(getWebSocket())).init())

export { feedsManager }