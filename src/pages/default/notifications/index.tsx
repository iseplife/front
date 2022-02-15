import React, {useCallback, useContext, useEffect, useMemo, useState} from "react"
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
import NotificationsCenter from "../../../components/Notification/NotificationsCenter"

const NotificationsPage: React.FC = () => {
    const {t} = useTranslation("notifications")
    const {state: {user}, dispatch} = useContext(AppContext)

    const unwatchedNotifications = useMemo(() => user.unwatchedNotifications, [])

    useEffect(() => document.documentElement.click(), [])// Closes all dropdown menus (including notifications' one)

    return (
        <div className="sm:mt-5 flex container mx-auto">
            <div className="hidden md:block md:w-1/12 lg:w-1/5 xl:w-1/4">

            </div>
            <div className="mx-4 md:mx-10 sm:col-span-2 flex flex-grow flex-col p-4 shadow-sm rounded-lg bg-white my-5">
                    
                <div className="flex-1">
                    <div className="mb-5 items-center flex">
                        <h3 className="text-black mx-2 mb-0 font-bold text-2xl leading-4 mt-1 block">
                            {t("notifications")}{!!unwatchedNotifications && ` (${unwatchedNotifications})`}
                        </h3>
                    </div>
                </div>
                <NotificationsCenter fullPage={true}></NotificationsCenter>
            </div>
            <div className="hidden md:block md:w-1/12 lg:w-1/5 xl:w-1/4">
                
            </div>
        </div>
    )
}

export default NotificationsPage