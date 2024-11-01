import { useLiveQuery } from "dexie-react-hooks"
import FaviconNotify from "favicon-notify"
import { useEffect, useMemo, useState } from "react"
import { notificationManager } from "../../datamanager/NotificationManager"

const NotificationFaviconTitle: React.FC = () => {
    const unwatchedNotifications = useLiveQuery(async () => (await notificationManager.isWebPushEnabled() && !await notificationManager.isSubscribed()) + await notificationManager?.getUnwatched() as number, [])

    const titleElement = document.querySelector("head > title") as HTMLTitleElement

    const [loaded, setLoaded] = useState(false)

    const favicon = useMemo(() => {
        const favicon = new FaviconNotify({
            withCounter: false,
            labelSize: 60,
            labelOffset: 5,
        }, document.getElementById("favicon") as HTMLLinkElement)

        favicon.ready(() =>
            setLoaded(true)
        )

        return favicon
    }, [])

    useEffect(() => {
        if(!loaded)
            return

        const base = titleElement.text.includes("\n") ? titleElement.text.split("\n")[1] : titleElement.text
        titleElement.text = unwatchedNotifications ? `(${unwatchedNotifications})  \n${base}` : base

        if(unwatchedNotifications)
            favicon.add()
        else
            favicon.remove()
    }, [unwatchedNotifications, loaded])

    return <></>
}

export default NotificationFaviconTitle
