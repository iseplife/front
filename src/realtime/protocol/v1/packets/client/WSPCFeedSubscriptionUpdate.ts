import DataWriter from "../../../../DataWriter"
import PacketOut from "../../../PacketOut"

export default class WSPCFeedSubscriptionUpdate implements PacketOut {
    constructor(
        public feedId: number,
        public subscribe: boolean,
    ) { }
  
    public write(dataWriter: DataWriter): void {
        dataWriter.writeUInt(this.feedId)
        dataWriter.writeBoolean(this.subscribe)
    }
}
