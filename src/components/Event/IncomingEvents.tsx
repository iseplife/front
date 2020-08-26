import React, {useEffect, useState} from "react"
import {EventPreview} from "../../data/event/types"
import {getIncomingEvents} from "../../data/event"
import {useTranslation} from "react-i18next"
import {Skeleton} from "antd"
import EventPreviewList from "./EventPreviewList";
import {IconFA} from "../Common/IconFA";

type IncomingEventsProps = {
    feed?: number
    className?: string
}
const IncomingEvents: React.FC<IncomingEventsProps> = ({feed, className}) => {
    const {t} = useTranslation("event")
    const [events, setEvents] = useState<EventPreview[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true)
        getIncomingEvents(feed).then(res => {
            //setEvents(res.data)
        }).finally(() => setLoading(false))
    }, [feed])

    return (
        <div className={`${className} flex flex-col justify-center text-left md:text-center`}>
            <h3 className="font-dinotcb text-gray-800 text-lg">{t("incoming")}</h3>
            {loading ?
                <>
                    <Skeleton.Input className="w-full rounded my-1" active size="large" />
                    <Skeleton.Input className="w-full rounded my-1" active size="large" />
                    <Skeleton.Input className="w-full rounded my-1" active size="large" />
                </> :
                events.length ?
                    <EventPreviewList events={events} />:
                    <div className="text-gray-500 mt-3 text-center text-xs">
                        <IconFA className="block" name="fa-sad-cry" type="regular" size="4x" />
                        <p>{t("no_events")}</p>
                    </div>
            }
        </div>
    )
}
IncomingEvents.defaultProps = {
    className: ""
}

export default IncomingEvents