import { EventPreview } from "../../../../data/event/types"
import DataReader from "../../../DataReader"
import PacketIn from "../../PacketIn"

export default class WSPSEventCreated implements PacketIn {

    event!: EventPreview

    read(dataReader: DataReader): void {
        this.event = JSON.parse(dataReader.readString())
        
        //Converts timestamps to dates
        this.event.startsAt = new Date(this.event.startsAt)
        this.event.endsAt = new Date(this.event.endsAt)
    }

}
