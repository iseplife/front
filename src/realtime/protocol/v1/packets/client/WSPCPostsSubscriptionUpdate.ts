import DataWriter from "../../../../DataWriter"
import PacketOut from "../../../PacketOut"

export default class WSPCPostsSubscriptionUpdate implements PacketOut {
    constructor(
        public posts: { id: number, subscribe: boolean }[],
    ) { }
  

    public write(dataWriter: DataWriter): void {
        dataWriter.writeUByte(this.posts.length)
        for (const post of this.posts) {
            dataWriter.writeUInt(post.id)
            dataWriter.writeBoolean(post.subscribe)
        }
    }
}
