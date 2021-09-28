import DataReader from "../../../../DataReader"
import PacketIn from "../../../PacketIn"

export default class WSPSConnected implements PacketIn {

    userId!: number

    read(dataReader: DataReader): void {
        this.userId = dataReader.readUInt()
    }

}
