import React, { useContext, useEffect, useState } from "react"
import Notification from "."
import { AppContext } from "../../context/app/context"
import { loadNotifications } from "../../data/notification"
import { Notification as NotificationObject } from "../../data/notification/types"

const NotificationsCenter: React.FC = () => {
    const {state: {user: {unwatchedNotifications}}} = useContext(AppContext)
    const [notifications, setNotifications] = useState([] as NotificationObject[])
    useEffect(() => {
        loadNotifications(0).then(notifs => setNotifications(notifs.data.content))
    }, [])
    return (
        <div className="fixed top-16 right-6 rounded-lg shadow-lg w-80 max-h-96 bg-white pb-2">
            <div className="font-bold text-2xl px-4 py-2.5">Notifications{!!unwatchedNotifications && ` (${unwatchedNotifications})`}</div>
            {notifications.map(notif =>
                <Notification {...notif} key={notif.id}></Notification>
            )}
        </div>
    )
}
export default NotificationsCenter