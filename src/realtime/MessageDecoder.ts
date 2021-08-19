import DataReader from "./DataReader"
import PacketIn from "./protocol/PacketIn"
import ProtocolV1 from "./protocol/v1/ProtocolV1"

class MessageDecoder {
    public decode(data: ArrayBuffer) {
        const dataReader = new DataReader(data)
        while (dataReader.canRead()) {
            const packet: PacketIn = new ProtocolV1.instance.packetsServer[dataReader.readUByte()]()
            packet.read(dataReader)

            for (const handler of packet.listeners!)
                handler.method.call(handler.instance, packet)
        }
        dataReader.view = null!//OPTI
    }

}

export default MessageDecoder