import { Notification } from "../../../../data/notification/types"
import DataReader from "../../../DataReader"
import PacketIn from "../../PacketIn"

export default class WSPSNotificationReceived implements PacketIn {

    notification!: Notification

    read(dataReader: DataReader): void {
        this.notification = JSON.parse(dataReader.readString())
        this.notification.creation = new Date(this.notification.creation)
    }

}
