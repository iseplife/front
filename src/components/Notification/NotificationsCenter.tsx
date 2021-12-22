import React, { useContext, useEffect, useMemo, useState } from "react"
import Notification from "."
import { AppContext } from "../../context/app/context"
import { loadNotifications, setNotificationsWatched } from "../../data/notification"
import { Notification as NotificationObject } from "../../data/notification/types"
import { AppActionType } from "../../context/app/action"

const NotificationsCenter: React.FC = () => {
    const { state: { user }, dispatch } = useContext(AppContext)
    
    const unwatchedNotifications = useMemo(() => user.unwatchedNotifications, [])

    const [notifications, setNotifications] = useState([] as NotificationObject[])
    useEffect(() => {
        loadNotifications(0).then(notifs => {
            setNotifications(notifs.data.content)
            const unwatched = notifs.data.content.filter(notif => !notif.watched)
            setNotificationsWatched(...unwatched)
            dispatch({
                type: AppActionType.SET_LOGGED_USER,
                user: { ...user, unwatchedNotifications: user.unwatchedNotifications - unwatched.length }
            })
        })
    }, [])
    return (
        <div className="fixed top-16 right-6 rounded-lg shadow-lg w-80 max-h-[calc(100vh-4rem-1rem)] bg-white pb-2 overflow-auto scrollbar-thin">
            <div className="font-bold text-2xl px-4 py-2.5">Notifications{!!unwatchedNotifications && ` (${unwatchedNotifications})`}</div>
            {notifications.map(notif =>
                <Notification {...notif} key={notif.id}></Notification>
            )}
        </div>
    )
}
export default NotificationsCenter