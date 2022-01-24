import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react"
import Notification from "."
import { AppContext } from "../../context/app/context"
import { loadNotifications, setNotificationsWatched } from "../../data/notification"
import { Notification as NotificationType } from "../../data/notification/types"
import { useTranslation } from "react-i18next"
import NotificationSkeleton from "../Skeletons/NotificationSkeleton"
import {AppActionType} from "../../context/app/action"
import { Link } from "react-router-dom"

interface NotificationsCenterProps {
    fullPage?: boolean
    className?: string
}

const NotificationsCenter: React.FC<NotificationsCenterProps> = ({fullPage, className}) => {
    const { t } = useTranslation("notifications")
    const { state: { user }, dispatch } = useContext(AppContext)
    
    const unwatchedNotifications = useMemo(() => user.unwatchedNotifications, [])
    const [notifications, setNotifications] = useState<NotificationType[]>([])
    const [loading, setLoading] = useState(false)
    const [showSkeleton, setShowSkeleton] = useState(false)

    const main = useMemo(() => document.getElementById("main"), [])
    const elementRef = React.createRef<HTMLDivElement>()
    const skeletonsRef = React.createRef<HTMLDivElement>()

    // Show skeletons only if waiting a significant time
    setTimeout(() => setShowSkeleton(true))


    const isLoaderInView = useCallback(()=> {
        const elementBoundingRect = (fullPage ? main : elementRef?.current)?.getBoundingClientRect()
        return ((skeletonsRef?.current?.getBoundingClientRect().y ?? Number.MAX_SAFE_INTEGER) - 200) < ((elementBoundingRect?.y ?? 0) + (elementBoundingRect?.height ?? 0))
    }, [fullPage, skeletonsRef, elementRef])

    const scrollHandler = useCallback(() => (
        isLoaderInView() && loadMoreNotifications()
    ), [skeletonsRef, elementRef])

    const loadMoreNotifications = useCallback(async () => {
        if(loading)
            return

        setLoading(true)
        const page = (await loadNotifications(0)).data
        setNotifications(page.content)
        setLoading(false)

        const unwatched = page.content.filter(notif => !notif.watched)
        if(unwatched.length){
            const unwatchedCount = (await setNotificationsWatched(unwatched)).data
            if(unwatchedCount)
                dispatch({
                    type: AppActionType.SET_UNWATCHED_NOTIFICATIONS,
                    payload: unwatchedCount
                })
        }

        if(isLoaderInView())
            loadMoreNotifications()
    }, [user, loading])

    /* Scroll to top if on mobile view
    (because it will not automatically scroll back to top when changing route) */
    useEffect(()=>{
        if(fullPage && main)
            main.scrollTop = 0
    }, [fullPage])

    /* Fetch notification on first load */
    useEffect(() => {
        loadMoreNotifications()
    }, [])

    useLayoutEffect(() => {
        if(isLoaderInView())
            loadMoreNotifications()
    }, [notifications])

    useLayoutEffect(() => {
        main?.addEventListener("scroll", scrollHandler)

        return () =>  main?.removeEventListener("scroll", scrollHandler)
    }, [scrollHandler])

    return (
        <div ref={elementRef} onScroll={scrollHandler} className={`${className} text-neutral-800 px-1`}>
            <NotificationSkeleton
                amount={Math.min(user.totalNotifications, 15)}
                loading={true}
                className={(showSkeleton ? "opacity-100 " : "opacity-0 ") + "delay-75 transition-opacity w-full left-0 z-10 " + (!loading && "opacity-0 absolute ")}
            />
            {notifications.map(notif =>
                <Notification {...notif} key={notif.id}/>
            )}
            <div className="w-full px-3">
                <Link
                    to="/notifications"
                    className="text-center text-gray-500 block hover:text-gray-600 hover:bg-black hover:bg-opacity-5 transition-colors rounded-lg p-2"
                >
                    {t("see_more")}
                </Link>
            </div>
        </div>
    )
}
export default NotificationsCenter