import DataReader from "../../../DataReader"
import PacketIn from "../../PacketIn"

export default class WSPSFeedPostCommentsUpdate implements PacketIn {

    threadID!: number
    comments!: number

    read(dataReader: DataReader): void {
        this.threadID = dataReader.readUInt()
        this.comments = dataReader.readUInt()
    }

}
