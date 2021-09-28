import { WSServerClient } from "../../websocket/WSServerClient"
import PacketHandlerFunction from "./PacketHandlerFunction"

export default class PacketListener {
    listeners!: Map<any, string>

    constructor(public client: WSServerClient) { }

    public register() {
        console.log("[WebSocket packetlistener debug] Registering ", this);
        (Object.getPrototypeOf(this) as PacketListener).listeners.forEach((value, key) => {
            const func = (this as any)[value]
            if(!key.prototype.listeners.find((handler: PacketHandlerFunction) => handler.instance == this && handler.method == func))
                key.prototype.listeners.push(new PacketHandlerFunction(func, this))
        })
    }

    public unregister() {
        console.log("[WebSocket packetlistener debug] Unregistering ", this)
        const packets = new Set<any>()
        const prototype = (Object.getPrototypeOf(this) as PacketListener)

        prototype.listeners.forEach((value, key) =>
            packets.add(key)
        )

        for (const packet of packets) {
            const listeners = packet.prototype.listeners as PacketHandlerFunction[]
            packet.prototype.listeners = listeners.filter(handler => handler.instance != this)
        }
    }
}