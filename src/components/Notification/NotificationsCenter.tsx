import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { AppContext } from "../../context/app/context"
import { loadNotifications, setNotificationsWatched } from "../../data/notification"
import { Notification as NotificationType } from "../../data/notification/types"
import { useTranslation } from "react-i18next"
import NotificationSkeleton from "../Skeletons/NotificationSkeleton"
import {AppActionType} from "../../context/app/action"
import { add, isAfter } from "date-fns"
import { Divider } from "antd"
import Notification from "../../components/Notification"
import InfiniteScroller from "../Common/InfiniteScroller"

interface NotificationsCenterProps {
    fullPage?: boolean
    className?: string
}

const NotificationsCenter: React.FC<NotificationsCenterProps> = ({fullPage, className}) => {
    const { t } = useTranslation("notifications")
    const { state: { user }, dispatch } = useContext(AppContext)
    
    const [notificationIds, setNotificationIds] = useState<Set<number>>(new Set())
    const [recentNotifications, setRecentNotifications] = useState<NotificationType[]>([])
    const [oldNotifications, setOldNotifications] = useState<NotificationType[]>([])

    const [empty, setEmpty] = useState<boolean>(false)

    const loadedNotifications = useMemo(() => (
        oldNotifications.length + recentNotifications.length
    ), [oldNotifications, recentNotifications])

    const loadMoreNotifications = useCallback(async (count: number) => {
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

        const unwatched = res.data.content.filter(notif => !notif.watched)
        if (unwatched.length) {
            try{
                const unwatchedCount = (await setNotificationsWatched(unwatched)).data
                if (unwatchedCount)
                    dispatch({
                        type: AppActionType.SET_UNWATCHED_NOTIFICATIONS,
                        payload: unwatchedCount
                    })
            }catch(e){
                console.error(e)
            }
        }

        if (count === 0 && res.data.content.length === 0)
            setEmpty(true)

        return res.data.last
    }, [notificationIds])

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