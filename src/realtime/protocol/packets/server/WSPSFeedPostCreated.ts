import {Post} from "../../../../data/post/types"
import DataReader from "../../../DataReader"
import PacketIn from "../../PacketIn"

export default class WSPSFeedPostCreated implements PacketIn {

    follow!: boolean
    hasWriteAccess!: boolean
    post!: Post

    read(dataReader: DataReader): void {
        this.follow = dataReader.readBoolean()
        this.hasWriteAccess = dataReader.readBoolean()
        this.post = JSON.parse(dataReader.readString())
    }

}
