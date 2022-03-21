import React from "react"
import { AppContext } from "../context/app/context"
import { getIncomingEvents } from "../data/event"
import { EventPreview } from "../data/event/types"
import LoggedEvent from "../events/LoggedEvent"
import PacketHandler from "../realtime/protocol/listener/PacketHandler"
import WSPSEventCreated from "../realtime/protocol/v1/packets/server/WSPSEventCreated"
import WSPSGroupJoined from "../realtime/protocol/v1/packets/server/WSPSGroupJoined"
import WSPSGroupLeft from "../realtime/protocol/v1/packets/server/WSPSGroupLeft"
import { getWebSocket, WSServerClient } from "../realtime/websocket/WSServerClient"
import DataManager from "./DataManager"
import { groupManager } from "./GroupManager"

export default class EventsManager extends DataManager<EventPreview> {
    constructor(wsServerClient: WSServerClient, private context: React.ContextType<typeof AppContext>){
        super("events", ["id", "feedId", "type", "title", "startsAt", "endsAt"], wsServerClient)
    }

    protected async initData() {
        const data = (await getIncomingEvents()).data
        await this.addBulkData(data)
        await this.getTable().bulkDelete(
            (await this.getEvents())
                .filter(event => !data.find(other => other.id == event.id))
                .map(event => event.id)
        )
    }

    public async getEvents(feed?: number): Promise<EventPreview[]>{
        const events = (await this.getTable().toArray()).sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
        if(feed == undefined)
            return events
        else
            return events.filter(event => event.targets.includes(feed))
    }

    public async getEventByEventFeedId(feedId: number): Promise<EventPreview> {
        return (await this.getTable().where("feedId").equals(feedId).first())!
    }

    @PacketHandler(WSPSEventCreated)
    private handleEventCreated(packet: WSPSEventCreated){
        console.debug("[Event] Created :", packet.event)
        this.addData(packet.event)
    }

    private async removeEvent(event: EventPreview){
        await this.getTable().delete(event.id)
    }

    @PacketHandler(WSPSGroupJoined)
    private handleGroupJoined() {
        setTimeout(() => this.initData())
    }
    @PacketHandler(WSPSGroupLeft)
    private async handleGroupLeft(packet: WSPSGroupLeft) {
        const group = (await groupManager.getGroups()).find(group => group.id == packet.id)
        if(group){
            console.log("Successfully detected left group for events")
            const newFeedsId = this.context.state.payload.feeds.filter(feedId => feedId != group?.feedId)
            for(const event of (await this.getEvents()).filter(event => 
                event.targets.length != 0 && !event.targets.find(event => newFeedsId.includes(event))
            )){
                this.removeEvent(event)
            }
        }
    }
    
}
let eventsManager = new EventsManager(undefined!, undefined!)

window.addEventListener("logged", (event) => (eventsManager = new EventsManager(getWebSocket(), (event as LoggedEvent).context)).init())

export { eventsManager }