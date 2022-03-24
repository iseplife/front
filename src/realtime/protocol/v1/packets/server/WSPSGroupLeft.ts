import { TokenSet } from "../../../../../data/security/types"
import DataReader from "../../../../DataReader"
import PacketIn from "../../../PacketIn"

export default class WSPSGroupLeft implements PacketIn {

    id!: number
    jwt!: TokenSet

    read(dataReader: DataReader): void {
        this.id = dataReader.readUInt()
        this.jwt = JSON.parse(dataReader.readString())
    }

}
