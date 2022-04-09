import MessageDecoder from "../MessageDecoder"
import DataWriter from "../DataWriter"
import ConnectedListener from "../listeners/ConnectedListener"
import PacketOut from "../protocol/PacketOut"
import PacketListener from "../protocol/listener/PacketListener"
import WSEventType from "./WSEventType"
import GroupListener from "../listeners/GroupListener"
import React from "react"
import { AppContext } from "../../context/app/context"
import PacketProtocol from "../protocol/PacketProtocol"

class WSServerClient {
    private static reconnectTimeout: number

    private socket!: WebSocket
    private messageDecoder!: MessageDecoder
    private queue: PacketOut[] = []
    private buffer: DataWriter = new DataWriter(new ArrayBuffer(1024 * 2))
    private accessToken!: string

    public listeners: PacketListener[] = []

    private _connected!: boolean
    get connected() { return this._connected }

    private _logged = false

    private context!: React.ContextType<typeof AppContext>

    constructor(
        public ip: string,
    ) {
        // Clear listeners
        PacketProtocol.instance.packetsServer.forEach(packet => packet.listeners = [])
    }

    /**
     * Se connecte et s'authentifie au serveur.
     * @param username Le nom d'utilisateur du client
     * @param accessToken AccessToken renouvelé à utiliser pour se connecter
     */
    public connect(context: React.ContextType<typeof AppContext>, retry = false) {
        if (this.connected)
            return
        if(!retry)
            clearTimeout(WSServerClient.reconnectTimeout)
        this.context = context
        this.accessToken = context.state.jwt
        this.socket = new WebSocket(this.ip)
        this.initSocket(retry)
    }
    private initSocket(retry = false) {
        this.messageDecoder = new MessageDecoder()
        this.socket.binaryType = "arraybuffer"
        this.socket.onopen = (()) => {
            window.dispatchEvent(new Event(WSEventType.CONNECTED))

            this.socket.send(this.accessToken)
            this._connected = true
            this._dispatchConnected()
        }
        this.socket.onclose = () => this._dispatchDisconnected()
        this.socket.onmessage = (event) => this.messageDecoder.decode(event.data)
        
        if (!retry)
            this._registerListeners()
    }

    private _dispatchDisconnected() {
        if (this._connected) {
            const event = new Event(WSEventType.DISCONNECTED)
            window.dispatchEvent(event)
            console.debug("[WebSocket] Disconnected")
        } else
            console.debug("[WebSocket] Connection failed")
        
        this._connected = false

        WSServerClient.reconnectTimeout = window.setTimeout(() => 
            this.connect(this.context, true)
        , 1000)
        
    }

    private _dispatchConnected(){
        const event = new Event(WSEventType.DISCONNECTED)
        window.dispatchEvent(event)
    }

    private _registerListeners() {
        new ConnectedListener(this).register()
        new GroupListener(this, this.context).register()
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
        console.debug("disconnect")
        for(const listener of this.listeners)
            listener.unregister()
        
        if(this.socket) this.socket.close()
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
