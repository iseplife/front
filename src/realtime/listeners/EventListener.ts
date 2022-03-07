import PacketHandler from "../protocol/listener/PacketHandler"
import PacketListener from "../protocol/listener/PacketListener"
import WSPSEventCreated from "../protocol/v1/packets/server/WSPSEventCreated"
import WSPSFeedPostCreated from "../protocol/v1/packets/server/WSPSFeedPostCreated"

export default class EventListener extends PacketListener {

    @PacketHandler(WSPSEventCreated)
    public handleNewPost(packet: WSPSFeedPostCreated) {
        console.log(`New post in feed ${packet.post.feedId} :`, packet.post)
    }
}