import WSEventType from "../realtime/websocket/WSEventType"
import Dexie from "dexie"
import PacketListener from "../realtime/protocol/listener/PacketListener"
import { WSServerClient } from "../realtime/websocket/WSServerClient"

export default abstract class DataManager<T> extends PacketListener {
    private needDataLoad = false

    protected _currentPage = -1
    protected _fetching = false
    protected _waitingForFetchEnd: (() => void)[] = []

    protected database!: Dexie
    constructor(name: string, indexedProps: string[], wsServerClient: WSServerClient) {
        super(wsServerClient)

        this.database = new Dexie(name)
        this.database.version(1).stores({
            data: indexedProps.join(", "), // Primary key and indexed props
            context: "type",
        })
        this.removeContext("minFreshId")

        this.registerEvent("logout", () => 
            this.unregister()
        )
    }

    async isLastPage() {
        return await this.getMinFresh() == -1 && await this.didLastPage()
    }

    protected getTable() {
        return this.database.table<T>("data")
    }
    protected getContext(type: string) {
        return this.database.table("context").where("type").equals(type).first()
    }
    protected setContext(type: string, object: {[key: string]: unknown} = {}) {
        return this.database.table("context").put({
            type,
            ...object
        })
    }
    protected removeContext(type: string) {
        return this.database.table("context").delete(type)
    }
    public async getMinFresh(): Promise<number> {
        return (await this.getContext("minFreshId"))?.objectId ?? Number.MAX_SAFE_INTEGER
    }
    protected async setMinFresh(id: number) {
        await this.setContext("minFreshId", { objectId: id })
    }
    public async didLastPage() {
        return !!(await this.getContext("lastPage"))
    }
    protected async setLastPage() {
        await this.setContext("lastPage")
    }

    protected async getResultsByPage() {
        return (await this.getContext("resultsByPage"))?.count
    }
    protected async setResultsByPage(count: number) {
        await this.setContext("resultsByPage", { count })
    }

    protected async addData(data: T) {
        await this.getTable().put(data)
    }

    protected async addBulkData(data: T[]) {
        await this.getTable().bulkPut(data)
    }

    private registredEventsListener: [string, (event: Event) => void][] = []

    protected registerEvent(event: string, callback: (event: Event) => void) {
        window.addEventListener(event, callback)
        this.registredEventsListener.push([event, callback])
    }

    public async init(){
        await this.initData()
        this.register()
        this.registerEvent(WSEventType.CONNECTED, () => {
            if(this.needDataLoad) {
                console.log("Loading data on reconnect for", this)
                this.needDataLoad = false

                this.initData()
            }
        })
        this.registerEvent(WSEventType.DISCONNECTED, () => {
            this.needDataLoad = true
        })
    }

    public async unregister() {
        this.database.delete()
        this.database.close()
        
        super.unregister()

        this.registredEventsListener.forEach(event => window.removeEventListener(...event))
    }
    
    protected abstract initData(): Promise<void>
}