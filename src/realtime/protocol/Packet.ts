import DataReader from "../DataReader"
import DataWriter from "../DataWriter"
import PacketHandlerFunction from "./listener/PacketHandlerFunction"

interface Packet {
   id?: number
   listeners?: PacketHandlerFunction[]
}

export default Packet