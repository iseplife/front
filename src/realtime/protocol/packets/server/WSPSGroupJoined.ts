import { GroupPreview } from "../../../../data/group/types"
import DataReader from "../../../DataReader"
import PacketIn from "../../PacketIn"

export default class WSPSGroupJoined implements PacketIn {

    group!: GroupPreview

    read(dataReader: DataReader): void {
        this.group = JSON.parse(dataReader.readString())
    }

}
