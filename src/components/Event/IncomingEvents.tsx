import React, {useCallback, useEffect, useState} from "react"
import {EventPreview} from "../../data/event/types"
import {getIncomingEvents} from "../../data/event"
import {useTranslation} from "react-i18next"
import {Skeleton} from "antd"
import EventPreviewList from "./EventPreviewList"
import {IconFA} from "../Common/IconFA"
import EventCreatorModal from "./EventCreatorModal"

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
            <h3 className="font-dinotcb text-gray-800 text-lg mx-3">{t("incoming")}</h3>
            {wait || loading ?
                <>
                    <Skeleton.Input className="w-full rounded my-1" active size="large"/>
                    <Skeleton.Input className="w-full rounded my-1" active size="large"/>
                    <Skeleton.Input className="w-full rounded my-1" active size="large"/>
                </> :
                events.length ?
                    <EventPreviewList events={events}/> :
                    <div className="text-gray-500 mt-3 text-center text-xs">
                        <IconFA className="block" name="fa-sad-cry" type="regular" size="4x"/>
                        <p>{t("no_events")}</p>
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