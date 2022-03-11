import { PostUpdate } from "../../../../../data/post/types"
import DataReader from "../../../../DataReader"
import PacketIn from "../../../PacketIn"

export default class WSPSFeedPostCreated implements PacketIn {

    follow!: boolean
    post!: PostUpdate

    read(dataReader: DataReader): void {
        this.follow = dataReader.readBoolean()
        this.post = JSON.parse(dataReader.readString())
    }

}
