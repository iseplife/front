import React, {useCallback, useEffect, useState} from "react"
import {EventPreview} from "../../data/event/types"
import {getIncomingEvents} from "../../data/event"
import {useTranslation} from "react-i18next"
import {Divider, Skeleton} from "antd"
import EventPreviewList from "./EventPreviewList"
import EventCreatorModal from "./EventCreatorModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSadCry } from "@fortawesome/free-regular-svg-icons"

type IncomingEventsProps = {
    feed?: number
    wait?: boolean
    allowCreate?: boolean
    className?: string
}
const IncomingEvents: React.FC<IncomingEventsProps> = ({feed, allowCreate, className, wait = false}) => {
    const {t} = useTranslation("event")
    const [events, setEvents] = useState<EventPreview[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const fetchEvents = useCallback(() => {
        if (!wait) {
            setLoading(true)
            getIncomingEvents(feed).then(res => {
                setEvents(res.data)
            }).finally(() => setLoading(false))
        }
    }, [wait, feed])

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    return (
        <div className={`${className} flex flex-col justify-center text-left lg:text-center mx-0 lg:mx-4`}>
            <Divider className="text-gray-700 text-lg sm:hidden" orientation="left">{t("incoming")}</Divider>
            <h3 className="text-gray-700 text-lg lg:mx-3 hidden sm:block">{t("incoming")}</h3>
            {wait || loading ?
                <div className="flex gap-2.5 sm:flex-col sm:mb-4">
                    <Skeleton.Input className="w-full rounded h-[92px] sm:h-[76px]" active size="large"/>
                    <Skeleton.Input className="w-full rounded h-[92px] sm:h-[76px]" active size="large"/>
                    <Skeleton.Input className="w-full rounded h-[92px] sm:h-[76px]" active size="large"/>
                </div> :
                events.length ?
                    <EventPreviewList events={events}/> :
                    <div className="text-gray-500 sm:mt-2 mb-2 text-center text-base sm:text-lg">
                        <FontAwesomeIcon icon={faSadCry} size="2x" className="hidden sm:inline mb-1" />
                        <div className="text-xs sm:mb-1">{t("no_events")}</div>
                    </div>
            }
            {allowCreate && (
                <div className="mx-auto mb-2">
                    <EventCreatorModal onSubmit={fetchEvents}/>
                </div>
            )}
        </div>
    )
}
IncomingEvents.defaultProps = {
    className: "",
    allowCreate: false
}

export default IncomingEvents
