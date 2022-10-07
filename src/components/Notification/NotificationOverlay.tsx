import React, { useCallback, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLiveQuery } from "dexie-react-hooks"
import { notificationManager } from "../../datamanager/NotificationManager"
import { Notification as NotificationType } from "../../data/notification/types"
import Notification from "."
import { setNotificationsWatched } from "../../data/notification"
import { notificationSoundUrl } from "../../constants/AudioFiles"
import { isWeb } from "../../data/app"

const NotificationsOverlay: React.FC = () => {
    const minNotificationId = useLiveQuery(async () => await notificationManager.getMaxLoaded(), [])

    const notifications = useLiveQuery(async () => {
        if(minNotificationId != undefined && minNotificationId != Number.MAX_SAFE_INTEGER)
            return (await notificationManager.getNotifications(minNotificationId)).filter(notif => !notif.watched)
    }, [minNotificationId])

    const unwatched = useLiveQuery(() => notificationManager.getUnwatched(), [])

    
    const [lastUnwatched, setLastUnwatched] = useState<NotificationType[]>([])

    useEffect(() => {
        if(notifications?.find(notif => !lastUnwatched.find(other => other.id == notif.id))){
            if(isWeb){
                const audio = new Audio(notificationSoundUrl)
                audio.play()
            }
            setLastUnwatched(notifications ?? [])
        }
    }, [notifications, lastUnwatched])


    const clickNotifFactory = useCallback((notif: NotificationType) => {
        return () => {
            setNotificationsWatched([notif]).then(res => res.data).then(unwatchedCount => {
                notificationManager.setUnwatched(unwatchedCount)
                notificationManager.watch([notif])
            }).catch(e => console.error(e))
        }
    }, [])

    return <div className="fixed left-3 flex-col gap-3 w-80 hidden sm:flex bottom-16 md:bottom-3">
        { unwatched != 0 && notifications?.map(notif => 
            <div onClick={clickNotifFactory(notif)}>
                <Notification {...notif} key={notif.id} backgroundHover={false} className={"bg-white shadow-sm hover:bg-[#fcfcfc] hover:shadow-md transition-all"} />
            </div>
        ) }
    </div>

}
export default NotificationsOverlay