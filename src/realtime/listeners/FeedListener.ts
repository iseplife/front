import PacketHandler from "../protocol/listener/PacketHandler"
import PacketListener from "../protocol/listener/PacketListener"
import WSPSFeedPostCreated from "../protocol/v1/packets/server/WSPSFeedPostCreated"

export default class FeedListener extends PacketListener {

    @PacketHandler(WSPSFeedPostCreated)
    public handleNewPost(packet: WSPSFeedPostCreated) {
        console.log(`New post in feed ${packet.post.feedId} :`, packet.post)
    }
}