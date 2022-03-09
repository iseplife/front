import MessageDecoder from "../MessageDecoder"
import DataWriter from "../DataWriter"
import ConnectedListener from "../listeners/ConnectedListener"
import PacketOut from "../protocol/PacketOut"
import PacketListener from "../protocol/listener/PacketListener"
import FeedListener from "../listeners/FeedListener"
import WSEventType from "./WSEventType"
import GroupListener from "../listeners/GroupListener"
import React from "react"
import { AppContext } from "../../context/app/context"
import ProtocolV1 from "../protocol/v1/ProtocolV1"

class WSServerClient {
    private socket!: WebSocket
    private messageDecoder!: MessageDecoder
    private queue: PacketOut[] = []
    private buffer: DataWriter = new DataWriter(new ArrayBuffer(1024 * 2))
    private accessToken!: string

    public listeners: PacketListener[] = []

    private _connected!: boolean
    get connected() { return this._connected }

    private _logged = false

    constructor(
        public ip: string,
    ) {
        // Clear listeners
        ProtocolV1.instance.packetsServer.forEach(packet => packet.listeners = [])
    }

    /**
     * Se connecte et s'authentifie au serveur.
     * @param username Le nom d'utilisateur du client
     * @param accessToken AccessToken renouvelé à utiliser pour se connecter
     */
    public connect(context: React.ContextType<typeof AppContext>) {
        if (this.connected)
            return
        new GroupListener(this, context).register()
        this.accessToken = context.state.jwt
        this.socket = new WebSocket(this.ip)
        this.initSocket()
    }
    private initSocket() {
        this.messageDecoder = new MessageDecoder()
        this.socket.binaryType = "arraybuffer"
        this.socket.onopen = (event) => {
            this.socket.send(this.accessToken)
            this._connected = true
            this._dispatchConnected()
        }
        this.socket.onclose = this.socket.onerror = this._dispatchDisconnected
        this.socket.onmessage = (event) => 
            this.messageDecoder.decode(event.data)
        this._registerListeners()
    }

    private _dispatchDisconnected(){
        const event = new Event(WSEventType.DISCONNECTED)
        window.dispatchEvent(event)
    }

    private _dispatchConnected(){
        const event = new Event(WSEventType.DISCONNECTED)
        window.dispatchEvent(event)
    }

    private _registerListeners() {
        new ConnectedListener(this).register()
        new FeedListener(this).register()
    }

    public setLogged() {        
        this._logged = true
        for (const packet of this.queue)
            this.forcePacket(packet)
        this.queue = []
    }

    public sendPacket(packet: PacketOut) {
        if (this._logged)
            this.forcePacket(packet)
        else
            this.queue.push(packet)
    }
    public async forcePacket(packet: PacketOut) {
        this.buffer.writeUByte(packet.id!)
        packet.write(this.buffer)
        this.socket.send(this.buffer.getAndReset())
    }

    public disconnect() {
        console.log("disconnect")
        for(const listener of this.listeners)
            listener.unregister()
        this.socket.close()
    }
}

let instance: WSServerClient

function initWebSocket(ip: string) {
    return instance ?? (instance = new WSServerClient(ip))
}
function getWebSocket() {
    return instance
}
function logoutWebSocket() {
    instance?.disconnect()
    instance = undefined!
}

export { WSServerClient, getWebSocket, initWebSocket, logoutWebSocket}