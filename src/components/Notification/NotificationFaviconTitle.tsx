import { useLiveQuery } from "dexie-react-hooks"
import { useEffect, useMemo } from "react"
import { notificationManager } from "../../datamanager/NotificationManager"
import FaviconNotify from "favicon-notify"

const favicon = new FaviconNotify({
    withCounter: false,
    labelSize: 60,
    labelOffset: 5,
}, document.getElementById("favicon") as HTMLLinkElement)

const NotificationFaviconTitle: React.FC = () => {
    const unwatchedNotifications = useLiveQuery(async () => (await notificationManager.isWebPushEnabled() && !await notificationManager.isSubscribed()) + await notificationManager?.getUnwatched() as number, [])

    const titleElement = document.querySelector("head > title") as HTMLTitleElement
    useEffect(() => {
        const base = titleElement.text.includes("\n") ? titleElement.text.split("\n")[1] : titleElement.text
        titleElement.text = unwatchedNotifications ? `(${unwatchedNotifications})  \n${base}` : base

        if(unwatchedNotifications)
            favicon.add()
        else
            favicon.remove()
    }, [unwatchedNotifications])

    return <></>
}

export default NotificationFaviconTitle