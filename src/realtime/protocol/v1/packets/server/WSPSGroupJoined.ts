import { GroupPreview } from "../../../../../data/group/types"
import { TokenSet } from "../../../../../data/security/types"
import DataReader from "../../../../DataReader"
import PacketIn from "../../../PacketIn"

export default class WSPSGroupJoined implements PacketIn {

    group!: GroupPreview
    jwt!: TokenSet

    read(dataReader: DataReader): void {
        this.group = JSON.parse(dataReader.readString())
        this.jwt = JSON.parse(dataReader.readString())
    }

}
