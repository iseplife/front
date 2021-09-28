import Protocol from "../Protocol"
import WSPCFeedSubscriptionUpdate from "./packets/client/WSPCFeedSubscriptionUpdate"
import WSPCPostsSubscriptionUpdate from "./packets/client/WSPCPostsSubscriptionUpdate"
import WSPSConnected from "./packets/server/WSPSConnected"

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
        const packetsClient: any[] = []
        packetsClient.push(WSPCPostsSubscriptionUpdate)
        packetsClient.push(WSPCFeedSubscriptionUpdate)

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