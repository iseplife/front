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
import pushService from "../../services/PushService"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faMoon } from "@fortawesome/free-solid-svg-icons"
import {faSadCry} from "@fortawesome/free-regular-svg-icons"

interface NotificationsCenterProps {
    fullPage?: boolean
    className?: string
}

const NotificationsCenter: React.FC<NotificationsCenterProps> = ({fullPage, className}) => {
    const { t } = useTranslation("notifications")
    const { state: { user } } = useContext(AppContext)
    const [loading, setLoading] = useState<boolean>(false)

    const showPushAsk = useLiveQuery(async () => await notificationManager.isWebPushEnabled() && !await notificationManager.isSubscribed(), [])
    const pushRejected = useLiveQuery(async () => await notificationManager.isRejected(), [])


    const minNotificationId = useLiveQuery(async () => {
        console.log("check min notif id")
        const id = await notificationManager.getMinFresh()
        console.log("FOUND "+id)
        return id
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
    console.log({
        pushRejected,
        showPushAsk,
        notifications,
        minNotificationId
    })

    const loadedNotifications = useMemo(() => (
        oldNotifications.length + recentNotifications.length
    ), [oldNotifications, recentNotifications])
    
    const empty = useMemo(() => notifications?.length == 0 && !loading, [notifications?.length, loading])

    const loadMoreNotifications = useCallback(async (count: number) => {
        if (count != 0 && minNotificationId != undefined) {
            try {
                setLoading(true)
                return await notificationManager.loadMore(minNotificationId)
            } finally {
                setLoading(false)
            }
        }
        return false
    }, [minNotificationId])

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

    const [subscribing, setSubscribing] = useState(false)

    const callbackNotif = useCallback((accept: boolean) => {
        if(accept) 
            return async () => {
                setSubscribing(true)

                await pushService.subscribeUser()
                
                setSubscribing(false)
            }
        return () => {
            pushService.refuse()
        }
    }, [])

    const unReject = useCallback(() =>
        notificationManager.setRejected(false)
    , [])

    const scrollElement = useRef<HTMLDivElement>(null)
    return (
        <div ref={scrollElement} className={`${className} text-neutral-800 px-1`}>
            {subscribing &&
                <div className="fixed top-0 left-0 w-screen h-screen bg-neutral-500/70 backdrop-blur-sm z-50" />
            }
            <InfiniteScroller
                watch="DOWN"
                callback={loadMoreNotifications}
                empty={empty && !loading}
                triggerDistance={150}
                scrollElement={!fullPage && scrollElement.current?.parentElement}
                loadingComponent={
                    <NotificationSkeleton amount={Math.min(user.totalNotifications - loadedNotifications, 45)} loading={true} className="transition-opacity w-full" />
                }
            >
                {showPushAsk && 
                    <div className="mb-0.5 w-full px-4 py-2.5 items-center left-32 flex rounded-lg transition-colors bg-red-100 bg-opacity-50 hover:bg-opacity-70">
                        <div className="w-10 h-10 rounded-full shadow-sm flex-shrink-0 grid place-items-center bg-red-400 text-white">
                            <FontAwesomeIcon icon={faBell}/>
                        </div>
                        <div className="ml-2.5 text-sm w-full">
                            <div className="font-semibold">
                                {t("notif_are_here")}
                            </div>
                            {t("receive_here")}
                            <div className={"flex mt-2 " + (subscribing && "pointer-events-none opacity-70")}>
                                <button onClick={callbackNotif(false)} className="bg-red-400 rounded px-3 py-1.5 text-white font-semibold hover:shadow-md transition-shadow">
                                    {t("refuse")}
                                </button>
                                <button onClick={callbackNotif(true)} className="ml-2 bg-green-400 rounded px-3 py-1.5 text-white font-semibold hover:shadow-md transition-shadow">
                                    {t("accept")}
                                </button>
                            </div>
                        </div>   
                    </div>
                }
                {pushRejected && 
                    <div onClick={unReject} className="bg-indigo-400/30 rounded-lg mb-0.5 w-full text-sm px-3 py-2 flex items-center justify-center text-indigo-400 cursor-pointer">
                        <FontAwesomeIcon icon={faMoon} className="text-base mr-0.5" />
                        {t("rejected")}
                    </div>
                }

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