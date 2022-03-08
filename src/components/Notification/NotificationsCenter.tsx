import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { AppContext } from "../../context/app/context"
import { useTranslation } from "react-i18next"
import NotificationSkeleton from "../Skeletons/NotificationSkeleton"
import { add, isAfter } from "date-fns"
import { Divider } from "antd"
import Notification from "../../components/Notification"
import InfiniteScroller from "../Common/InfiniteScroller"
import { useLiveQuery } from "dexie-react-hooks"
import { notificationManager } from "../../datamanager/NotificationManager"
import { AppActionType } from "../../context/app/action"
import { setNotificationsWatched } from "../../data/notification"

interface NotificationsCenterProps {
    fullPage?: boolean
    className?: string
}

const NotificationsCenter: React.FC<NotificationsCenterProps> = ({fullPage, className}) => {
    const { t } = useTranslation("notifications")
    const { state: { user }, dispatch } = useContext(AppContext)
    
    const [notificationIds, setNotificationIds] = useState<Set<number>>(new Set())

    const [empty, setEmpty] = useState<boolean>(false)

    const minNotificationId = useLiveQuery(async () => {
        return await notificationManager.getMinFresh()
    }, [])

    const notifications = useLiveQuery(async () => {
        if(minNotificationId != undefined)
            return await notificationManager.getNotifications(minNotificationId)
    }, [minNotificationId])

    const recentNotifications = useMemo(() => {
        const oneWeekAgo = add(new Date(), { weeks: -1 })
        return notifications?.filter(notif => isAfter(notif.creation, oneWeekAgo)) ?? []
    }, [notifications])
    const oldNotifications = useMemo(() => {
        const oneWeekAgo = add(new Date(), { weeks: -1 })
        return notifications?.filter(notif => !isAfter(notif.creation, oneWeekAgo)) ?? []
    }, [notifications])

    const loadedNotifications = useMemo(() => (
        oldNotifications.length + recentNotifications.length
    ), [oldNotifications, recentNotifications])
    
    const loadMoreNotifications = useCallback(async (count: number) => {
        return count != 0 && minNotificationId != undefined && await notificationManager.loadMore(minNotificationId)
    }, [notificationIds, minNotificationId])

    useEffect(() => {
        if (notifications) {
            const unwatched = notifications.filter(notif => !notif.watched)
            if (unwatched.length) {
                try {
                    setNotificationsWatched(unwatched).then(res => res.data).then(unwatchedCount => {
                        dispatch({
                            type: AppActionType.SET_UNWATCHED_NOTIFICATIONS,
                            payload: unwatchedCount
                        })
                    }).catch(e => console.error(e))
                }catch(e){
                    console.error(e)
                }
            }
        }
    }, [notifications])

    useEffect(() => () => { // On component destroy
        if (notifications) {
            const unwatched = notifications.filter(notif => !notif.watched)
            if (unwatched.length)
                notificationManager.watch(unwatched)
        }
    }, [user.unwatchedNotifications, notifications])

    const scrollElement = useRef<HTMLDivElement>(null)
    return (
        <div ref={scrollElement} className={`${className} text-neutral-800 px-1`}>
            <InfiniteScroller
                watch="DOWN"
                callback={loadMoreNotifications}
                empty={empty}
                triggerDistance={150}
                scrollElement={!fullPage && scrollElement.current?.parentElement}
                loadingComponent={
                    <NotificationSkeleton amount={Math.min(user.totalNotifications - loadedNotifications, 45)} loading={true} className="transition-opacity w-full" />
                }
            >
                {recentNotifications.map(notif =>
                    <Notification {...notif} key={notif.id} />
                )}
                {!!oldNotifications?.length &&
                    <Divider className="text-gray-700 text-base" orientation="left">{t("long_ago")}</Divider>}
                {oldNotifications.map(notif =>
                    <Notification {...notif} key={notif.id} />
                )}
            </InfiniteScroller>
        </div>
    )
}
export default NotificationsCenter