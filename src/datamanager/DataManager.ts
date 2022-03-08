import WSEventType from "../realtime/websocket/WSEventType"
import Dexie from "dexie"

export default abstract class DataManager<T> {
    private needDataLoad = false

    protected _currentPage = -1
    protected _fetching = false
    protected _waitingForFetchEnd: (() => void)[] = []

    protected database!: Dexie
    constructor(name: string, indexedProps: string[]) {
        this.database = new Dexie(name)
        this.database.version(1).stores({
            data: indexedProps.join(", "), // Primary key and indexed props
            context: "type",
        })
        this.database.table("context").delete("minFreshId")

        this.registerEvent("logout", () => 
            this.unregister()
        )
    }

    async isLastPage() {
        return await this.getMinFresh() == -1 && await this.didLastPage()
    }

    protected getTable() {
        return this.database.table("data")
    }
    public async getMinFresh(): Promise<number> {
        return (await this.database.table("context").where("type").equals("minFreshId").first())?.objectId ?? Number.MAX_SAFE_INTEGER
    }
    protected async setMinFresh(id: number) {
        await this.database.table("context").put({ type: "minFreshId", objectId: id })
    }
    public async didLastPage() {
        return !!(await this.database.table("context").where("type").equals("lastPage").first())
    }
    protected async setLastPage() {
        await this.database.table("context").put({ type: "lastPage" })
    }

    protected async getResultsByPage() {
        return (await this.database.table("context").where("type").equals("resultsByPage").first()).count
    }
    protected async setResultsByPage(count: number) {
        await this.database.table("context").put({ type: "resultsByPage", count })
    }

    protected async addData(data: unknown) {
        await this.getTable().put(data)
    }

    protected async addBulkData(data: unknown[]) {
        await this.getTable().bulkPut(data)
    }

    private registredEventsListener: [string, (event: Event) => void][] = []

    protected registerEvent(event: string, callback: (event: Event) => void) {
        window.addEventListener(event, callback)
        this.registredEventsListener.push([event, callback])
    }

    public async init(){
        await this.initData()
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
    }
    
    protected abstract initData(): Promise<void>
}