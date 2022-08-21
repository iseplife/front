import DataReader from "../../../DataReader"
import PacketIn from "../../PacketIn"

export default class WSPSFeedPostOwnLikeUpdate implements PacketIn {

    threadID!: number
    like!: boolean

    read(dataReader: DataReader): void {
        this.threadID = dataReader.readUInt()
        this.like = dataReader.readBoolean()
    }

}
