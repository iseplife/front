import { PostUpdate } from "../../../../../data/post/types"
import DataReader from "../../../../DataReader"
import PacketIn from "../../../PacketIn"

export default class WSPSFeedPostRemoved implements PacketIn {

    id!: number

    read(dataReader: DataReader): void {
        this.id = dataReader.readUInt()
    }

}
