import { useLiveQuery } from "dexie-react-hooks"
import { getIncomingEvents } from "../data/event"
import { EventPreview } from "../data/event/types"
import { getUserGroups } from "../data/group"
import { GroupPreview } from "../data/group/types"
import PacketHandler from "../realtime/protocol/listener/PacketHandler"
import WSPSEventCreated from "../realtime/protocol/v1/packets/server/WSPSEventCreated"
import WSPSGroupJoined from "../realtime/protocol/v1/packets/server/WSPSGroupJoined"
import WSPSGroupLeft from "../realtime/protocol/v1/packets/server/WSPSGroupLeft"
import { getWebSocket, WSServerClient } from "../realtime/websocket/WSServerClient"
import DataManager from "./DataManager"

export default class EventsManager extends DataManager<EventPreview> {
    constructor(wsServerClient: WSServerClient){
        super("groups", ["id", "type", "title", "startsAt", "endsAt", "targets"], wsServerClient)
    }

    protected async initData() {
        const data = (await getIncomingEvents()).data
        await this.getTable().clear()
        this.addBulkData(data)
    }

    public getEvents(){
        return this.getTable().toArray()
    }

    @PacketHandler(WSPSEventCreated)
    private handleEventCreated(packet: WSPSEventCreated){
        console.log("[Event] Created :", packet.event)
        this.addData(packet.event)
    }

    @PacketHandler(WSPSGroupJoined)
    private handleGroupJoined() {
        setTimeout(() => this.initData())
    }
    @PacketHandler(WSPSGroupLeft)
    private handleGroupLeft() {
        setTimeout(() => this.initData())
    }
    
}
let eventsManager = new EventsManager(undefined!)

window.addEventListener("logged", () => (eventsManager = new EventsManager(getWebSocket())).init())

export { eventsManager }