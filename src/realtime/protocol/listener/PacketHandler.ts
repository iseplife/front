import PacketListener from "./PacketListener"

function PacketHandler(packetType: any) {
    return function (target: PacketListener, key: string) {
        const listeners = target.listeners ? target.listeners : target.listeners = new Map()
        listeners.set(packetType, key)
    }
}

export default PacketHandler