import Packet from "../Packet"
import PacketListener from "./PacketListener"

export default class PacketHandlerFunction {
    constructor(
        public method: (packet: Packet) => void,
        public instance: PacketListener
    ) { }
}