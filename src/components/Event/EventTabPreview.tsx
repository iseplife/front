import React from "react"
import {EventTabPreview as PreviewType} from "../../data/event/types"
import {Link} from "react-router-dom"
import { useTranslation } from "react-i18next"
import { _format } from "../../util"
import { EventTypeEmoji } from "../../constants/EventType"
import GalleryCard from "../Gallery/GalleryCard"
import LinkEntityPreloader from "../Optimization/LinkEntityPreloader"

type EventTabProps = {
    event: PreviewType
    className?: string
}
const EventTabPreview: React.FC<EventTabProps> = ({ event, className }) => {
    const {t} = useTranslation("event")
    return (
        <LinkEntityPreloader preview={event}>
            <Link to={`/event/${event.id}`} className={`w-full text-gray-700 hover:text-gray-500 ${className}`}>
                <div
                    title={event.title}
                    className="px-3 py-2 shadow-sm rounded-lg bg-white"
                >
                    <div className="flex flex-col sm:flex-row items-center">
                        <div className="text-center pb-1">
                            <div className="w-12 h-12 md:w-14 md:h-14 relative">
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
                        <span className="flex-1 text-left font-semibold text-lg -mb-1 sm:mb-0 sm:text-xl truncate sm:ml-2.5 xl:ml-3.5 whitespace-normal line-clamp-1">
                            {event.title}
                        </span>
                    </div>
                    {
                        event.galleries?.map(g => <GalleryCard gallery={g} key={g.id} />)
                    }
                </div>
            </Link>
        </LinkEntityPreloader>
    )
}

export default EventTabPreview