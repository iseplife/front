import DataReader from "../DataReader"
import Packet from "./Packet"

interface PacketIn extends Packet {
   read(dataReader: DataReader): void
}

export default PacketIn