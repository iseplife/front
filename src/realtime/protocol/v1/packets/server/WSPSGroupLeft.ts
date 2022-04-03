import DataReader from "../../../../DataReader"
import PacketIn from "../../../PacketIn"

export default class WSPSGroupLeft implements PacketIn {

    id!: number

    read(dataReader: DataReader): void {
        this.id = dataReader.readUInt()
    }

}
