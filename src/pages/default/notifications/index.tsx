import React, {useCallback, useContext, useMemo, useState} from "react"
import {useTranslation} from "react-i18next"
import {AppContext} from "../../../context/app/context"
import {Notification as NotificationType} from "../../../data/notification/types"
import NotificationSkeleton from "../../../components/Skeletons/NotificationSkeleton"
import Notification from "../../../components/Notification"
import InfiniteScroller from "../../../components/Common/InfiniteScroller"
import {loadNotifications, setNotificationsWatched} from "../../../data/notification"
import {AppActionType} from "../../../context/app/action"
import {add, isAfter} from "date-fns"
import {Divider} from "antd"

const NotificationsPage: React.FC = () => {
    const {t} = useTranslation("notifications")
    const {state: {user}, dispatch} = useContext(AppContext)

    const unwatchedNotifications = useMemo(() => user.unwatchedNotifications, [])

    const [notificationIds, setNotificationIds] = useState<Set<number>>(new Set())
    const [recentNotifications, setRecentNotifications] = useState<NotificationType[]>([])
    const [oldNotifications, setOldNotifications] = useState<NotificationType[]>([])

    const [loading, setLoading] = useState<boolean>(true)
    const [empty, setEmpty] = useState<boolean>(false)

    const loadedNotifications = useMemo(() => (
        oldNotifications.length + recentNotifications.length
    ), [oldNotifications, recentNotifications])

    const main = useMemo(() => document.getElementById("main"), [])

    const loadMoreNotifications = useCallback(async (count: number) => {
        setLoading(true)
        const res = await loadNotifications(count)

        const oneWeekAgo = add(new Date(), {weeks: -1})
        const old: NotificationType[] = []
        const recent: NotificationType[] = []
        const ids: number[] = []
        res.data.content.forEach(notif => {
            if(!notificationIds.has(notif.id)){
                const notifGroup = isAfter(notif.creation, oneWeekAgo) ? recent : old
                notifGroup.push(notif)
                ids.push(notif.id)
            }
        })

        setRecentNotifications(notifs => [...notifs, ...recent])
        setOldNotifications(notifs => [...notifs, ...old])
        setNotificationIds(set => {
            ids.forEach(id => set.add(id))
            return set
        })

        setLoading(false)

        const unwatched = res.data.content.filter(notif => !notif.watched)
        if (unwatched.length) {
            const unwatchedCount = (await setNotificationsWatched(unwatched)).data
            if (unwatchedCount)
                dispatch({
                    type: AppActionType.SET_UNWATCHED_NOTIFICATIONS,
                    payload: unwatchedCount
                })
        }

        if (count === 0 && res.data.content.length === 0)
            setEmpty(true)

        return res.data.last
    }, [notificationIds])


    return (
        <div className="sm:mt-5 flex justify-center container mx-auto md:flex-nowrap flex-wrap">
            <div className="flex-1 ml-4">
                <div className="p-2 mb-5 items-center cursor-pointer flex">
                    <h3 className="text-black mx-2 mb-0 font-bold text-2xl text-gray-700 leading-4 mt-1 block">
                        {t("notifications")}{!!unwatchedNotifications && ` (${unwatchedNotifications})`}
                    </h3>
                </div>
            </div>
            <div style={{flex: "2 1 0%"}} className="mx-4 md:mx-10">
                <InfiniteScroller
                    className="bg-white p-2 rounded-lg"
                    watch="DOWN" callback={loadMoreNotifications} empty={empty}
                    loadingComponent={
                        <NotificationSkeleton
                            amount={Math.min(user.totalNotifications - loadedNotifications, 45)}
                            loading={loading}
                            className="transition-opacity w-full"
                        />
                    }
                >
                    {recentNotifications.map(notif =>
                        <Notification {...notif} key={notif.id}/>
                    )}
                    {oldNotifications.length > 0 && (
                        <Divider className="text-gray-700 text-base" orientation="left">
                            {t("long_ago")}
                        </Divider>
                    )}
                    {oldNotifications.map(notif =>
                        <Notification {...notif} key={notif.id}/>
                    )}
                </InfiniteScroller>
            </div>
            <div className="flex-1 lg:block hidden mr-4"/>
        </div>
    )
}

export default NotificationsPage