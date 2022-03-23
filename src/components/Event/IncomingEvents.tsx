import React from "react"
import {useTranslation} from "react-i18next"
import {Divider, Skeleton} from "antd"
import EventPreviewList from "./EventPreviewList"
import EventCreatorModal from "./EventCreatorModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSadCry } from "@fortawesome/free-regular-svg-icons"
import { useLiveQuery } from "dexie-react-hooks"
import { eventsManager } from "../../datamanager/EventsManager"

type IncomingEventsProps = {
    feed?: number
    wait?: boolean
    allowCreate?: boolean
    className?: string
}
const IncomingEvents: React.FC<IncomingEventsProps> = ({feed, allowCreate, className, wait = false}) => {
    const {t} = useTranslation("event")

    const events = useLiveQuery(async () => !wait && await eventsManager.getEvents(feed), [feed, wait])

    return (
        <div className={`${className} flex flex-col justify-center text-left lg:text-center mx-0 lg:mx-4`}>
            <Divider className="text-gray-700 text-lg sm:hidden" orientation="left">{t("incoming")}</Divider>
            <h3 className="text-gray-700 text-lg lg:mx-3 hidden sm:block">{t("incoming")}</h3>
            {wait || !events ?
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
                    <EventCreatorModal onSubmit={() => console.log("lol")}/>
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
