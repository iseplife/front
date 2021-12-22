import React, { useContext, useEffect, useMemo, useState } from "react"
import Notification from "."
import { AppContext } from "../../context/app/context"
import { loadNotifications, setNotificationsWatched } from "../../data/notification"
import { Notification as NotificationObject } from "../../data/notification/types"
import { AppActionType } from "../../context/app/action"
import { isAfter, isBefore } from "date-fns"
import moment from "moment"
import { Divider } from "antd"
import { useTranslation } from "react-i18next"

const NotificationsCenter: React.FC = () => {
    const { t } = useTranslation("notifications")
    const { state: { user }, dispatch } = useContext(AppContext)
    
    const unwatchedNotifications = useMemo(() => user.unwatchedNotifications, [])

    const [newNotifications, setNewNotifications] = useState([] as NotificationObject[])
    const [oldNotifications, setOldNotifications] = useState([] as NotificationObject[])
    useEffect(() => {
        loadNotifications(0).then(notifs => {
            const oneWeekAgo = moment().add(-1, "week").toDate()

            setNewNotifications(notifs.data.content.filter(notif => isAfter(notif.creation, oneWeekAgo)))
            setOldNotifications(notifs.data.content.filter(notif => isBefore(notif.creation, oneWeekAgo)))

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
            <div className="font-bold text-2xl px-4 py-2.5">{t("notifications")}{!!unwatchedNotifications && ` (${unwatchedNotifications})`}</div>
            {newNotifications.map(notif =>
                <Notification {...notif} key={notif.id}></Notification>
            )}
            {!!oldNotifications?.length && <Divider className="text-gray-700 text-base" orientation="left">{t("long_ago")}</Divider>}
            {oldNotifications.map(notif =>
                <Notification {...notif} key={notif.id}></Notification>
            )}

        </div>
    )
}
export default NotificationsCenter