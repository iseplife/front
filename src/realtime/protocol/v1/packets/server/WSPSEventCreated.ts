import { EventPreview } from "../../../../../data/event/types"
import { PostUpdate } from "../../../../../data/post/types"
import DataReader from "../../../../DataReader"
import PacketIn from "../../../PacketIn"

export default class WSPSEventCreated implements PacketIn {

    event!: EventPreview

    read(dataReader: DataReader): void {
        this.event = JSON.parse(dataReader.readString())
    }

}
