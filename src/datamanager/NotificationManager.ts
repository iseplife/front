import { loadNotifications } from "../data/notification"
import { Notification } from "../data/notification/types"
import DataManager from "./DataManager"
import { openDB } from "idb"

export default class NotificationManager extends DataManager<Notification> {

    constructor() {
        super("notifications")
    }

    protected async loadCache() {
        console.log("load cache")
    }

    protected async initData() {
        this._fetching = true

        const response = (await loadNotifications(0)).data
        this._data = response.content
        this._lastPage = response.last
        this._currentPage = response.number

        this._fetching = false
    }

}