import { loadNotifications } from "../data/notification"
import { Notification } from "../data/notification/types"
import DataManager from "./DataManager"
import { openDB } from "idb"

export default class NotificationManager extends DataManager<Notification> {

    constructor() {
        super("notifications", ["id"])
    }

    protected async initData() {
        await this.loadPage(0)
    }

    private async _waitFetching() {
        if (this._fetching)
            await new Promise<void>(executor => this._waitingForFetchEnd.push(executor))
    }

    protected async loadPage(page: number) {
        await this._waitFetching()
            
        if (await this.isLastPage())
            return true
        
        this._fetching = true
        
        console.log(`[Notifications] Fetching page ${page}.`)

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
        
        this._waitingForFetchEnd.shift()?.()
        
        return await this.isLastPage()
    }

    public async watch(notifications: Notification[]) {
        notifications.forEach(notif => notif.watched = true)
        this.getTable().bulkAdd(notifications)
    }

    public async loadMore(minId: number) {
        await this._waitFetching()
        return await this.loadPage(Math.floor(await this.getTable().where("id").aboveOrEqual(minId).count() / await this.getResultsByPage()))
    }

    public async getNotifications(minId: number): Promise<Notification[]> {
        return this.getTable().where("id").aboveOrEqual(minId).reverse().sortBy("id")
    }
    protected async isAnyInCache(ids: number[]): Promise<boolean> {
        return (await this.getTable().where("id").anyOf(ids).count()) > 0
    }

}
let notificationManager = new NotificationManager()

window.addEventListener("logged", () => notificationManager.init())
window.addEventListener("logout", () => notificationManager = new NotificationManager())

export { notificationManager }