import MessageDecoder from "../MessageDecoder"
import DataWriter from "../DataWriter"
import ConnectedListener from "../listeners/ConnectedListener"
import PacketOut from "../protocol/PacketOut"
import PacketListener from "../protocol/listener/PacketListener"
import FeedListener from "../listeners/FeedListener"
import EventListener from "../listeners/EventListener"
import WSEventType from "./WSEventType"
import NotificationManager from "../../datamanager/NotificationManager"

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
    ) { }

    /**
     * Se connecte et s'authentifie au serveur.
     * @param username Le nom d'utilisateur du client
     * @param accessToken AccessToken renouvelé à utiliser pour se connecter
     */
    public connect(accessToken: string) {
        if (this.connected)
            return
        this.accessToken = accessToken
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

        new NotificationManager()
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
        new EventListener(this).register()
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