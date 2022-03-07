import WSEventType from "../realtime/websocket/WSEventType"
import { openDB, IDBPDatabase, IDBPObjectStore } from "idb"

export default abstract class DataManager<T> {
    protected _data: T[] = []
    protected _deprecatedData: T[] = []
    get data(){ return this._data }

    private needDataLoad = false

    protected _currentPage = -1
    protected _lastPage = false
    protected _fetching = false

    protected database!: IDBPDatabase
    protected store!: IDBPObjectStore
    constructor(name: string, database?: IDBPDatabase) {
        if(!database)
            openDB(name, 1, {
                upgrade: (database, old) => {
                    switch(old) {
                        case 0:
                            database.createObjectStore("data")
                            break
                        default:
                            break
                    }
                    console.log("Upgrade database from", old)
                }
            }).then(database => this.database = database).then(() => this.init())
        else {
            this.database = database
        }
    }

    protected async getTable(name: string){
        try{
            return this.database.transaction(name, "readwrite").objectStore(name)
        }catch(e){
            console.log("done")
            this.database.createObjectStore(name)
            console.log("a")
            return this.database.transaction(name, "readwrite").objectStore(name)
        }
    }

    public async init(){
        console.log( this.getTable("test"))
        await this.loadCache()
        await this.initData()
        window.addEventListener(WSEventType.CONNECTED, () => {
            console.log("connected", this)
            if(this.needDataLoad){
                console.log("data load")
                this.needDataLoad = false

                this._deprecatedData = this.data
                this.initData()
            }
        })
        window.addEventListener(WSEventType.DISCONNECTED, () => {
            console.log("disconnected", this)
            this.needDataLoad = true
        })
    }
    
    protected abstract loadCache(): Promise<void>
    protected abstract initData(): Promise<void>
}