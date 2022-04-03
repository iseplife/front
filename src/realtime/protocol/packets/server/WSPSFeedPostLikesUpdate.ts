import DataReader from "../../../DataReader"
import PacketIn from "../../PacketIn"

export default class WSPSFeedPostLikesUpdate implements PacketIn {

    threadID!: number
    likes!: number

    read(dataReader: DataReader): void {
        this.threadID = dataReader.readUInt()
        this.likes = dataReader.readUInt()
    }

}
