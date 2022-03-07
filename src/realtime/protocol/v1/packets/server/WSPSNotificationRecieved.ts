import { PostUpdate } from "../../../../../data/post/types"
import DataReader from "../../../../DataReader"
import PacketIn from "../../../PacketIn"

export default class WSPSNotificationRecieved implements PacketIn {

    notification!: Notification

    read(dataReader: DataReader): void {
        this.notification = JSON.parse(dataReader.readString())
    }

}
