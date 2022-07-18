import PacketHandler from "../protocol/listener/PacketHandler"
import PacketListener from "../protocol/listener/PacketListener"
import WSPSBadToken from "../protocol/packets/server/WSPSBadToken"
import WSPSConnected from "../protocol/packets/server/WSPSConnected"

export default class ConnectedListener extends PacketListener {

    @PacketHandler(WSPSConnected)
    public handleConnected(packet: WSPSConnected) {
        console.debug(`Logged in with id: ${packet.userId}`)
        this.client.setLogged()
    }
    @PacketHandler(WSPSBadToken)
    public handleBadToken() {
        console.debug("Bad token when reconnecting to websocket !")
        this.client.setBadToken()
    }
}