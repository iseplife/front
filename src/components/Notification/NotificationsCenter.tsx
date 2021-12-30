import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react"
import Notification from "."
import { AppContext } from "../../context/app/context"
import { loadNotifications, setNotificationsWatched } from "../../data/notification"
import { Notification as NotificationObject } from "../../data/notification/types"
import {add, isAfter, isBefore} from "date-fns"
import { Divider } from "antd"
import { useTranslation } from "react-i18next"
import NotificationSkeleton from "../Skeletons/NotificationSkeleton"
import {AppActionType} from "../../context/app/action"

interface NotificationsCenterProps {
    fullPage?: boolean
    className?: string
}

const NotificationsCenter: React.FC<NotificationsCenterProps> = ({fullPage, className}) => {
    const { t } = useTranslation("notifications")
    const { state: { user }, dispatch } = useContext(AppContext)
    
    const unwatchedNotifications = useMemo(() => user.unwatchedNotifications, [])

    const [newNotifications, setNewNotifications] = useState<NotificationObject[]>([])
    const [oldNotifications, setOldNotifications] = useState<NotificationObject[]>([])

    const [loading, setLoading] = useState(true)
    const [showSkeleton, setShowSkeleton] = useState(false)
    const [isLastPage, setIsLastPage] = useState(true)
    const [currentPage, setCurrentPage] = useState(-1)
    const [loadingNotifs, setLoadingNotifs] = useState(false)

    const loadedNotifications = useMemo(() =>
        oldNotifications.length + newNotifications.length
    , [oldNotifications, newNotifications])

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
        if(loadingNotifs)
            return
        
        setLoadingNotifs(true)
        const page = (await loadNotifications(currentPage + 1)).data
        setLoading(false)

        setCurrentPage(page.number)
        setIsLastPage(page.last)
        setLoadingNotifs(false)

        const notifs = [...newNotifications, ...oldNotifications, ...page.content]
            .sort((a, b) => b.id - a.id)
            .filter((val, index, array) => array.findIndex(other => other.id == val.id) == index)

        const oneWeekAgo = add(new Date(), {weeks: -1})
        
        setNewNotifications(notifs.filter(notif => isAfter(notif.creation, oneWeekAgo)))
        setOldNotifications(notifs.filter(notif => isBefore(notif.creation, oneWeekAgo)))
        
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
    }, [user, loadingNotifs, currentPage, newNotifications, oldNotifications])

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
    }, [oldNotifications, newNotifications])

    useLayoutEffect(() => {
        main?.addEventListener("scroll", scrollHandler)

        return () =>  main?.removeEventListener("scroll", scrollHandler)
    }, [scrollHandler])

    return (
        <div ref={elementRef} onScroll={scrollHandler} className={`${className} notif_center md:fixed top-16 right-6 md:rounded-lg md:shadow-lg md:w-80 md:max-h-[calc(100vh-4rem-1rem)] md:bg-white md:pb-2 md:overflow-auto md:scrollbar-thin text-neutral-800`}>
            <div className="font-bold text-2xl px-4 py-2.5 text-black">
                {t("notifications")}{!!unwatchedNotifications && ` (${unwatchedNotifications})`}
            </div>
            <NotificationSkeleton amount={Math.min(user.totalNotifications, 15)} loading={true} className={(showSkeleton ? "opacity-100 " : "opacity-0 ") + "delay-75 transition-opacity w-full left-0 z-10 " + (!loading && "opacity-0 absolute ")} />
            {newNotifications.map(notif =>
                <Notification {...notif} key={notif.id} />
            )}
            {!!oldNotifications?.length && (
                <Divider className="text-gray-700 text-base" orientation="left">
                    {t("long_ago")}
                </Divider>
            )}
            {oldNotifications.map(notif =>
                <Notification {...notif} key={notif.id} />
            )}
            {!isLastPage && loadedNotifications < user.totalNotifications && (
                <div ref={skeletonsRef}>
                    <NotificationSkeleton amount={Math.min(user.totalNotifications - loadedNotifications, 45)} loading={true} className="transition-opacity w-full" />
                </div>
            )}
        </div>
    )
}
export default NotificationsCenter