import Protocol from "./Protocol"
import WSPSConnected from "./packets/server/WSPSConnected"
import WSPSEventCreated from "./packets/server/WSPSEventCreated"
import WSPSFeedPostCreated from "./packets/server/WSPSFeedPostCreated"
import WSPSFeedPostEdited from "./packets/server/WSPSFeedPostEdited"
import WSPSFeedPostLikesUpdate from "./packets/server/WSPSFeedPostLikesUpdate"
import WSPSFeedPostRemoved from "./packets/server/WSPSFeedPostRemoved"
import WSPSGroupJoined from "./packets/server/WSPSGroupJoined"
import WSPSGroupLeft from "./packets/server/WSPSGroupLeft"
import WSPSNotificationReceived from "./packets/server/WSPSNotificationReceived"
import WSPCKeepAlive from "./packets/client/WSPCKeepAlive"
import WSPSBadToken from "./packets/server/WSPSBadToken"
import WSPSFeedPostCommentsUpdate from "./packets/server/WSPSFeedPostCommentsUpdate"

class PacketProtocol implements Protocol {

    static instance = new PacketProtocol().init()

    public packetsServer: any[] = []
    public packetsClient: any[] = []

    registerPacketServer(packetClass: any): number {
        this.packetsServer.push(packetClass)
        return this.packetsServer.length - 1
    }

    registerPacketClient(packetClass: any): number {
        this.packetsClient.push(packetClass)
        return this.packetsClient.length - 1
    }

    init(): PacketProtocol {
        const packetsServer: any[] = []
        packetsServer.push(WSPSConnected)
        packetsServer.push(WSPSFeedPostCreated)
        packetsServer.push(WSPSNotificationReceived)
        packetsServer.push(WSPSEventCreated)
        packetsServer.push(WSPSGroupJoined)
        packetsServer.push(WSPSGroupLeft)
        packetsServer.push(WSPSFeedPostRemoved)
        packetsServer.push(WSPSFeedPostEdited)
        packetsServer.push(WSPSFeedPostLikesUpdate)
        packetsServer.push(WSPSBadToken)
        packetsServer.push(WSPSFeedPostCommentsUpdate)
        const packetsClient: any[] = []
        packetsClient.push(WSPCKeepAlive)

        for (const packet of packetsServer) {
            packet.prototype.id = this.registerPacketServer(packet)
            packet.prototype.listeners = []
        }
        for (const packet of packetsClient) {
            packet.prototype.id = this.registerPacketClient(packet)
            packet.prototype.listeners = []
        }

        return this
    }

}

export default PacketProtocol