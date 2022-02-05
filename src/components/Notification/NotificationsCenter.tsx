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

interface NotificationsCenterProps {
    fullPage?: boolean
    className?: string
}

const NotificationsCenter: React.FC<NotificationsCenterProps> = ({fullPage, className}) => {
    const { t } = useTranslation("notifications")
    const { state: { user }, dispatch } = useContext(AppContext)
    
    const [showSkeleton, setShowSkeleton] = useState(false)

    const [notificationIds, setNotificationIds] = useState<Set<number>>(new Set())
    const [recentNotifications, setRecentNotifications] = useState<NotificationType[]>([])
    const [oldNotifications, setOldNotifications] = useState<NotificationType[]>([])

    const [loading, setLoading] = useState(false)
    const [empty, setEmpty] = useState<boolean>(false)
    const [lastPage, setLastPage] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState<number>(-1)

    const loadedNotifications = useMemo(() => (
        oldNotifications.length + recentNotifications.length
    ), [oldNotifications, recentNotifications])

    const elementRef = useRef<HTMLDivElement>(null)
    const scrollableElement = useMemo(() => fullPage ? document.getElementById("main") : elementRef?.current?.parentElement, [elementRef?.current, fullPage])
    const skeletonsRef = useRef<HTMLDivElement>(null)

    // Show skeletons only if waiting a significant time
    setTimeout(() => setShowSkeleton(true))


    const isLoaderInView = useCallback(()=> {
        const elementBoundingRect = scrollableElement?.getBoundingClientRect()
        return ((skeletonsRef?.current?.getBoundingClientRect().y ?? Number.MAX_SAFE_INTEGER) - 200) < ((elementBoundingRect?.y ?? 0) + (elementBoundingRect?.height ?? 0))
    }, [fullPage, skeletonsRef, scrollableElement])

    const loadMoreNotifications = useCallback(async () => {
        if(loading)
            return
        console.log(loading)
        setLoading(true)
        const res = await loadNotifications(currentPage + 1)
        setCurrentPage(currentPage + 1)

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
        console.log("finish loading")

        const unwatched = res.data.content.filter(notif => !notif.watched)
        if (unwatched.length) {
            const unwatchedCount = (await setNotificationsWatched(unwatched)).data
            if (unwatchedCount)
                dispatch({
                    type: AppActionType.SET_UNWATCHED_NOTIFICATIONS,
                    payload: unwatchedCount
                })
        }

        if (currentPage === 0 && res.data.content.length === 0)
            setEmpty(true)

        setLastPage(res.data.last)
    }, [notificationIds, currentPage, loading])

    const scrollHandler = useCallback(() => {
        console.log(isLoaderInView())
        isLoaderInView() && loadMoreNotifications()
    }, [skeletonsRef, scrollableElement, loadMoreNotifications])


    /* Scroll to top if on mobile view
    (because it will not automatically scroll back to top when changing route) */
    useEffect(() => {
        if(fullPage && scrollableElement)
            scrollableElement.scrollTop = 0
    }, [fullPage])

    /* Fetch notification on first load */
    useEffect(() => {
        console.log("load start", loading)
        loadMoreNotifications()
    }, [])

    useLayoutEffect(() => {
        if(isLoaderInView() && currentPage != -1){
            console.log("load moreeeee+", loading, currentPage)
            loadMoreNotifications()
        }
    }, [currentPage, loadMoreNotifications, isLoaderInView, loading])

    useLayoutEffect(() => {
        scrollableElement?.addEventListener("scroll", scrollHandler)

        return () =>  scrollableElement?.removeEventListener("scroll", scrollHandler)
    }, [scrollHandler, scrollableElement])

    return (
        <div ref={elementRef} onScroll={scrollHandler} className={`${className} text-neutral-800 px-1`}>
            <NotificationSkeleton amount={Math.min(user.totalNotifications, 15)} loading={true} className={(showSkeleton ? "opacity-100 " : "opacity-0 ") + "delay-75 transition-opacity w-full left-0 z-10 " + ((recentNotifications.length + oldNotifications.length != 0 || empty) && "opacity-0 absolute ")} />
            {recentNotifications.map(notif =>
                <Notification {...notif} key={notif.id} />
            )}
            {!!oldNotifications?.length &&
                <Divider className="text-gray-700 text-base" orientation="left">{t("long_ago")}</Divider>}
            {oldNotifications.map(notif =>
                <Notification {...notif} key={notif.id} />
            )}
            {!lastPage && loadedNotifications < user.totalNotifications &&
                <div ref={skeletonsRef}>
                    <NotificationSkeleton amount={Math.min(user.totalNotifications - loadedNotifications, 45)} loading={true} className="transition-opacity w-full" />
                </div>
            }
        </div>
    )
}
export default NotificationsCenter