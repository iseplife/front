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
import NotificationSkeleton from "../Skeletons/NotificationSkeleton"

const NotificationsCenter: React.FC<{ className?: string }> = ({className}) => {
    const { t } = useTranslation("notifications")
    const { state: { user }, dispatch } = useContext(AppContext)
    
    const unwatchedNotifications = useMemo(() => user.unwatchedNotifications, [])

    const [newNotifications, setNewNotifications] = useState([] as NotificationObject[])
    const [oldNotifications, setOldNotifications] = useState([] as NotificationObject[])

    const [loading, setLoading] = useState(true)
    const [showSkeleton, setShowSkeleton] = useState(false)

    setTimeout(() => setShowSkeleton(true))// Show skeletons only if waiting a significant time

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
            setLoading(false)
        })
    }, [])

    return (
        <div className={className + " notif_center md:fixed top-16 right-6 md:rounded-lg md:shadow-lg md:w-80 md:max-h-[calc(100vh-4rem-1rem)] md:bg-white md:pb-2 md:overflow-auto md:scrollbar-thin text-neutral-800"}>
            <div className="font-bold text-2xl px-4 py-2.5 text-black">{t("notifications")}{!!unwatchedNotifications && ` (${unwatchedNotifications})`}</div>
            {<NotificationSkeleton amount={Math.min(user.totalNotifications, 15)} loading={true} className={(showSkeleton ? "opacity-100 " : "opacity-0 ") + "delay-75 transition-opacity w-full left-0 z-10 " + (!loading && "opacity-0 absolute ")}></NotificationSkeleton>}
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