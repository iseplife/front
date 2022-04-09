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
import { setNotificationsWatched } from "../../data/notification"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSadCry} from "@fortawesome/free-regular-svg-icons"

interface NotificationsCenterProps {
    fullPage?: boolean
    className?: string
}

const NotificationsCenter: React.FC<NotificationsCenterProps> = ({fullPage, className}) => {
    const { t } = useTranslation("notifications")
    const { state: { user } } = useContext(AppContext)
    const [empty, setEmpty] = useState<boolean>(true)

    const minNotificationId = useLiveQuery(async () => {
        return await notificationManager.getMinFresh()
    }, [])

    const notifications = useLiveQuery(async () => {
        if(minNotificationId != undefined) {
            const notifs = await notificationManager.getNotifications(minNotificationId)
            setEmpty(notifs.length == 0)

            return notifs
        }
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
    
    const loadMoreNotifications = useCallback(async (count: number) => 
        count != 0 && minNotificationId != undefined && await notificationManager.loadMore(minNotificationId)
    , [minNotificationId])

    useEffect(() => {
        if (notifications) {
            const unwatched = notifications.filter(notif => !notif.watched)
            if (unwatched.length) {
                try {
                    setNotificationsWatched(unwatched).then(res => res.data).then(unwatchedCount => 
                        notificationManager.setUnwatched(unwatchedCount)
                    ).catch(e => console.error(e))
                }catch(e){
                    console.error(e)
                }
            }
        }
    }, [notifications])

    useEffect(() => () => {
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
                {empty ?
                    <div className="text-gray-300 sm:mt-2 mb-2 text-center text-base sm:text-lg">
                        <FontAwesomeIcon icon={faSadCry} size="2x" className="hidden sm:inline mb-1" />
                        <div className="text-sm font-bold mt-2 sm:mb-1">{t("no_notifications")}</div>
                    </div> :
                    <>
                        {recentNotifications.map(notif =>
                            <Notification {...notif} key={notif.id} />
                        )}
                        {!!oldNotifications?.length &&
                            <Divider className="text-gray-700 text-base" orientation="left">{t("long_ago")}</Divider>}
                        {oldNotifications.map(notif =>
                            <Notification {...notif} key={notif.id} />
                        )}
                    </>
                }

            </InfiniteScroller>
        </div>
    )
}
export default NotificationsCenter