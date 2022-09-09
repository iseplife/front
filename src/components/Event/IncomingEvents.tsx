import React, { useEffect } from "react"
import {useTranslation} from "react-i18next"
import {Divider, Skeleton} from "antd"
import EventPreviewList from "./EventPreviewList"
import EventCreatorModal from "./EventCreatorModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSadCry } from "@fortawesome/free-regular-svg-icons"
import { useLiveQuery } from "dexie-react-hooks"
import { eventsManager } from "../../datamanager/EventsManager"
import ExpiryMap from "expiry-map"
import { EventPreview } from "../../data/event/types"

type IncomingEventsProps = {
    feed?: number
    wait?: boolean
    allowCreate?: boolean
    className?: string
}

const cache = new ExpiryMap(1000 * 60 * 60 * 10)

const IncomingEvents: React.FC<IncomingEventsProps> = ({feed, allowCreate, className, wait = false}) => {
    const {t} = useTranslation("event")
    const events = useLiveQuery(async () => !wait && await eventsManager.getEvents(feed), [feed, wait], cache.get(`${feed}`) as EventPreview[])

    useEffect(() => {
        if(events)
            return () => {cache.set(`${feed}`, events)}
    }, [events])

    return (
        <div className={`${className} flex flex-col justify-center text-left lg:text-center mx-0 lg:mx-4`}>
            <Divider className="text-gray-700 text-lg sm:hidden" orientation="left">{t("incoming")}</Divider>
            <h3 className="text-gray-700 text-lg lg:mx-3 hidden sm:block">{t("incoming")}</h3>
            {wait || !events ?
                <div className="flex gap-2.5 sm:flex-col sm:mb-4 hidden-scroller w-full max-w-[calc(100vw-16px*2)] sm:max-w-full overflow-x-auto ">
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
                    <EventCreatorModal />
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
