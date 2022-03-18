import Protocol from "../Protocol"
import WSPSConnected from "./packets/server/WSPSConnected"
import WSPSEventCreated from "./packets/server/WSPSEventCreated"
import WSPSFeedPostCreated from "./packets/server/WSPSFeedPostCreated"
import WSPSFeedPostEdited from "./packets/server/WSPSFeedPostEdited"
import WSPSFeedPostRemoved from "./packets/server/WSPSFeedPostRemoved"
import WSPSGroupJoined from "./packets/server/WSPSGroupJoined"
import WSPSGroupLeft from "./packets/server/WSPSGroupLeft"
import WSPSNotificationRecieved from "./packets/server/WSPSNotificationRecieved"

class ProtocolV1 implements Protocol {

    static instance = new ProtocolV1().init()

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

    init(): ProtocolV1 {
        const packetsServer: any[] = []
        packetsServer.push(WSPSConnected)
        packetsServer.push(WSPSFeedPostCreated)
        packetsServer.push(WSPSNotificationRecieved)
        packetsServer.push(WSPSEventCreated)
        packetsServer.push(WSPSGroupJoined)
        packetsServer.push(WSPSGroupLeft)
        packetsServer.push(WSPSFeedPostRemoved)
        packetsServer.push(WSPSFeedPostEdited)
        const packetsClient: any[] = []

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

export default ProtocolV1