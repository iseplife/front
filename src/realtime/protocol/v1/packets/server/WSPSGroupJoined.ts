import { EventPreview } from "../../../../../data/event/types"
import { GroupPreview } from "../../../../../data/group/types"
import { PostUpdate } from "../../../../../data/post/types"
import DataReader from "../../../../DataReader"
import PacketIn from "../../../PacketIn"

export default class WSPSGroupJoined implements PacketIn {

    group!: GroupPreview

    read(dataReader: DataReader): void {
        this.group = JSON.parse(dataReader.readString())
    }

}
