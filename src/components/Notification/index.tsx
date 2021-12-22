import { faUser } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Avatar } from "antd"
import React, { useEffect, useState } from "react"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { AvatarSizes } from "../../constants/MediaSizes"
import { Notification as NotificationObject } from "../../data/notification/types"
import { formatDateWithTimer, mediaPath } from "../../util"

const Notification: React.FC<NotificationObject> = (notification) => {
    const { t } = useTranslation(["common", "notifications"])
    const [formattedDate, setFormattedDate] = useState<string>("")
    useEffect(() => formatDateWithTimer(notification.creation, t, setFormattedDate), [notification.creation])
    return <Link to={notification.link} className="text-neutral-800 hover:text-neutral-800">
        <div className="w-full px-4 py-2.5 items-center left-32 flex cursor-pointer hover:bg-gray-200 hover:bg-opacity-60 rounded-lg transition-colors">
            <Avatar
                src={mediaPath(notification.icon, AvatarSizes.THUMBNAIL)}
                icon={<FontAwesomeIcon icon={faUser} />}
                alt={"notification"}
                size={"default"}
                className="w-10 h-10 rounded-full shadow-sm flex-shrink-0 grid place-items-center"></Avatar>
            <div className="ml-2.5 text-sm">
                <Trans components={{ "b\b": <b className="text-neutral-900 font-semibold" /> }}>
                    {t(`notifications:in_menu:${notification.type}`, notification.informations) }
                </Trans>
                <div className="text-indigo-500">{ formattedDate }</div>
            </div>
            {!notification.watched &&
                <div className="w-3.5 h-3.5 rounded-full shadow-lg bg-indigo-500 flex-shrink-0 ml-3">
                    <div className="w-3.5 h-3.5 rounded-full shadow-lg bg-indigo-500 animate-ping"></div>
                </div>
            }
        </div>
    </Link>
}

export default Notification
