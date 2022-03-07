import { PostUpdate } from "../../../../../data/post/types"
import DataReader from "../../../../DataReader"
import PacketIn from "../../../PacketIn"

export default class WSPSFeedPostCreated implements PacketIn {

    post!: PostUpdate

    read(dataReader: DataReader): void {
        this.post = JSON.parse(dataReader.readString())
    }

}
