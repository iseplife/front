import { PushNotifications } from "@capacitor/push-notifications"
import { useHistory } from "react-router"
import { isWeb } from "../../data/app"

const NotificationClickHandler = () => {
    const h = useHistory()
    if(!isWeb){
        PushNotifications.addListener("pushNotificationActionPerformed", notification => {
            const link = notification.notification.data.link
            h.push(`/${link}`)
            console.log("Go to "+link)
        })
    }
    return <></>
}

export default NotificationClickHandler