interface Protocol {
    packetsServer: any[]
    packetsClient: any[]
    registerPacketServer(packetClass: any): number
    registerPacketClient(packetClass: any): number
    init(): Protocol
}

export default Protocol