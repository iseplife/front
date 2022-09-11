import React from "react"
import {EventPreview as PreviewType} from "../../data/event/types"
import {Link} from "react-router-dom"
import { useTranslation } from "react-i18next"
import { mediaPath, _format } from "../../util"
import { EventTypeEmoji } from "../../constants/EventType"
import { WebPAvatarPolyfill } from "../Common/WebPPolyfill"
import { AvatarSizes } from "../../constants/MediaSizes"
import LinkEntityPreloader from "../Optimization/LinkEntityPreloader"
import { isBefore } from "date-fns/esm"

type EventProps = {
    event: PreviewType
}
const EventPreview: React.FC<EventProps> = ({ event }) => {
    const {t} = useTranslation("event")
    return (
        <LinkEntityPreloader preview={event} noWidth className="sm:truncate">
            <Link to={`/event/${event.id}`} className="w-full max-w-sm text-gray-700 hover:text-gray-500 relative">
                <div
                    title={event.title}
                    className="flex flex-col sm:flex-row px-3 py-2 shadow-sm rounded-lg bg-white items-center"
                >
                    <div className="text-center pb-1">
                        <div className="w-12 h-12 md:w-14 md:h-14 relative z-10">
                            {
                                isBefore(event.startsAt, new Date()) && 
                                <div className="absolute w-full h-full flex items-center justify-center">
                                    <div className="z-0 translate- bg-red-500 absolute rounded-md animate-ping h-8 w-8 md:h-9 md:w-9" />
                                </div>
                            }
                            <div className="w-full h-full mx-auto sm:mx-0 text-2xl md:text-3xl rounded-md bg-neutral-100 shadow-sm overflow-hidden font-medium relative flex flex-col flex-shrink-0">
                                <div className="bg-red-500 w-full h-4 text-xs text-neutral-100 leading-4 md:leading-5 md:text-sm md:h-5 flex-shrink-0  uppercase">
                                    {_format(event.startsAt, "MMM")}
                                </div>
                                <div className="grid place-items-center h-full">
                                    { event.startsAt.getDate() }
                                </div>
                            </div>
                            <div className="absolute -top-2.5 -right-2.5 text-lg rotate-12" title={t(`type.${event.type}`)}>{EventTypeEmoji[event.type]}</div>
                        </div>
                    </div>
                    <span className="flex-1 text-left font-semibold text-lg -mb-1 sm:mb-0 sm:text-xl truncate sm:ml-2.5 xl:ml-3.5">
                        {event.title}
                    </span>
                    <div className="absolute top-1 left-2.5 sm:left-auto sm:right-1">
                        <WebPAvatarPolyfill src={mediaPath(event.club.logoUrl, AvatarSizes.THUMBNAIL)} size="small" />
                    </div>
                </div>
            </Link>
        </LinkEntityPreloader>
    )
}

export default EventPreview