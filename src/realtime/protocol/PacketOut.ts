import DataWriter from "../DataWriter"
import Packet from "./Packet"

interface PacketOut extends Packet {
   write(dataWriter: DataWriter): void
}

export default PacketOut