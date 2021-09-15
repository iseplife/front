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
        <div className={`${className} flex flex-col justify-center text-left md:text-center`}>
            <Divider className="text-gray-700 text-lg sm:hidden" orientation="left">{t("incoming")}</Divider>
            <h3 className="text-gray-700 text-lg mx-3 hidden sm:block">{t("incoming")}</h3>
            {wait || loading ?
                <>
                    <Skeleton.Input className="w-full rounded my-1" active size="large"/>
                    <Skeleton.Input className="w-full rounded my-1" active size="large"/>
                    <Skeleton.Input className="w-full rounded my-1" active size="large"/>
                </> :
                events.length ?
                    <EventPreviewList events={events}/> :
                    <div className="text-gray-500 mt-2 text-center text-base sm:text-lg">
                        <FontAwesomeIcon icon={faSadCry} size="2x"/>
                        <p className="text-xs">{t("no_events")}</p>
                    </div>
            }
            {allowCreate && (
                <div className="mx-auto">
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
