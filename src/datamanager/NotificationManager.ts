import { loadNotifications } from "../data/notification"
import { Notification } from "../data/notification/types"
import DataManager from "./DataManager"
import { getWebSocket, WSServerClient } from "../realtime/websocket/WSServerClient"
import PacketHandler from "../realtime/protocol/listener/PacketHandler"
import GeneralEventType from "../constants/GeneralEventType"
import pushService from "../services/PushService"
import WSPSNotificationReceived from "../realtime/protocol/packets/server/WSPSNotificationReceived"

export default class NotificationManager extends DataManager<Notification> {

    constructor(wsServerClient: WSServerClient) {
        super("notifications", ["id"], wsServerClient)
    }

    protected async initData() {
        await pushService.initData()
        this.removeContext("maxLoaded")
        await this.loadPage(0)
        this.setContext("maxLoaded", { id: (await this.getNotifications(await this.getMinFresh())).reduce((prev, notif) => Math.max(prev, notif.id), 0) + 1 })
    }


    public register(): void {
        super.register()
    }

    public async getMaxLoaded(){
        return (await this.getContext("maxLoaded"))?.id ?? Number.MAX_SAFE_INTEGER
    }

    private async _waitFetching() {
        if (this._fetching)
            await new Promise<void>(executor => this._waitingForFetchEnd.push(executor))
    }

    public async isRejected(): Promise<boolean> {
        return (await this.getContext("rejected"))?.rejected ?? false
    }
    public async setRejected(rejected: boolean) {
        this.setContext("rejected", { rejected })
    }

    protected async loadPage(page: number) {
        await this._waitFetching()
            
        if (await this.isLastPage())
            return true
        
        this._fetching = true
        
        console.debug(`[Notifications] Fetching page ${page}.`)

        const response = (await loadNotifications(page)).data
        
        await this.setResultsByPage(response.size)

        const minId = response.content.reduce((prev, notif) => Math.min(notif.id, prev), Number.MAX_SAFE_INTEGER)
        if (await this.isAnyInCache(response.content.map(notif => notif.id)) && !await this.getTable().where("id").below(minId).and((item: Notification) => !item.watched).first())
            this.setMinFresh(-1)
        else
            this.setMinFresh(minId)
        
        await this.addBulkData(response.content)
        
        this._currentPage = response.number

        this._fetching = false
        
        if (response.last) {
            this.setMinFresh(-1)
            this.setLastPage()
        }

        const unwatched = response.content.reduce((prev, notif) => prev + +(!notif.watched), 0)
        if(page == 0 && await this.getUnwatched() < unwatched)
            this.setUnwatched(unwatched)
        
        this._waitingForFetchEnd.shift()?.()
        
        return await this.isLastPage()
    }

    public async watch(notifications: Notification[]) {
        notifications.forEach(notif => notif.watched = true)
        this.getTable().bulkPut(notifications)
    }

    public async loadMore(minId: number) {
        await this._waitFetching()
        return await this.loadPage(Math.floor(await this.getTable().where("id").aboveOrEqual(minId).count() / await this.getResultsByPage()))
    }

    public async getNotifications(minId: number): Promise<Notification[]> {
        return this.getTable().where("id").aboveOrEqual(minId).reverse().sortBy("id")
    }
    public async getNotificationsAndMinFresh(): Promise<[number, Notification[]]> {
        const minFresh = await this.getMinFresh()
        return [minFresh, await this.getTable().where("id").aboveOrEqual(minFresh).reverse().sortBy("id")]
    }
    public async getUnwatched(){
        return (await this.getContext("unwatched"))?.unwatched ?? 0
    }
    public async setUnwatched(unwatched: number){
        await this.setContext("unwatched", { unwatched })
    }
    protected async isAnyInCache(ids: number[]): Promise<boolean> {
        return (await this.getTable().where("id").anyOf(ids).count()) > 0
    }

    public async isWebPushEnabled(skipRejected?: boolean) {
        return (await this.getContext("webpush.enabled"))?.enabled as boolean && (skipRejected || !await this.isRejected())
    }
    public async setWebPushEnabled(enabled: boolean){
        this.setContext("webpush.enabled", { enabled })
    }

    public async isSubscribed(){
        return (await this.getContext("webpush.subscribed"))?.subscribed as boolean
    }
    public async setSubscribed(subscribed: boolean){
        this.setContext("webpush.subscribed", { subscribed })
    }

    @PacketHandler(WSPSNotificationReceived)
    private async handleNotificationReceived(packet: WSPSNotificationReceived){
        this.addData(packet.notification)
        this.setUnwatched(await this.getUnwatched() + 1)
    }

}
let notificationManager = new NotificationManager(undefined!)

window.addEventListener(GeneralEventType.LOGGED, () => (notificationManager = new NotificationManager(getWebSocket())).init())

export { notificationManager }
