import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { faCameraRetro } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { AxiosPromise } from "axios"
import { Page } from "../../data/request.type"
import { EventTabPreview as EventTabPreviewType } from "../../data/event/types"
import EventTabPreview from "./EventTabPreview"
import InfiniteScroller from "../Common/InfiniteScroller"

interface EventsTabProps {
    elementId: number
    getEventsCallback: (id: number, page?: number) => AxiosPromise<Page<EventTabPreviewType>>
}

const EventsTab: React.FC<EventsTabProps> = ({ elementId, getEventsCallback }) => {
    const { t } = useTranslation("event")
    const [events, setEvents] = useState<EventTabPreviewType[]>([])
    const [empty, setEmpty] = useState<boolean>()

    const loadNextEvents = useCallback(async (page: number) => {
        const res = await getEventsCallback(elementId, page)
        if (res.status === 200) {
            if (page === 0 && res.data.content.length === 0)
                setEmpty(true)
            setEvents(events => [...events, ...res.data.content.filter(event => !events.find(old => old.id == event.id))])
            return res.data.last
        }
        return false
    }, [elementId, getEventsCallback])
    
    useEffect(() => {
        setEvents([])
        setEmpty(false)
    }, [elementId])

    const loadingComponent = useMemo(() => <div>{
        Array(10).fill(
            <div
                className="text-gray-700 px-3 py-2 shadow-sm rounded-lg bg-white animate-pulse w-full my-2.5"
            >
                <div className="flex flex-col sm:flex-row items-center">
                    <div className="pb-1">
                        <div className="w-12 h-12 md:w-14 md:h-14 relative">
                            <div className="bg-neutral-100 w-full h-full mx-auto sm:mx-0 rounded-md shadow-sm overflow-hidden relative flex flex-col flex-shrink-0">
                                <div className="bg-red-500 w-full h-4 md:h-5 flex-shrink-0" />
                            </div>
                        </div>
                    </div>
                    <div className="block -mb-0.5 sm:mb-0.5 sm:text-xl sm:ml-2.5 xl:ml-3.5 w-28 h-[1.375rem] mt-1 bg-neutral-200 rounded-full" />
                </div>
            </div>
        )
    }</div>, [])

    return !elementId ? loadingComponent : (
        <InfiniteScroller
            watch="DOWN"
            callback={loadNextEvents}
            className="flex-row flex-wrap w-full mt-3"
            empty={empty}
            loadingComponent={loadingComponent}
            key={elementId}
        >
            {
                empty ? (
                    <div className="my-4 w-full text-center rounded text-sm text-neutral-400 mt-5">
                        <FontAwesomeIcon icon={faCameraRetro} className="text-4xl" />
                        <div className="text-neutral-500 mt-0.5">{t("no_events")}</div>
                    </div>
                ) : (
                    events.map(event => (
                        <EventTabPreview key={event.id} event={event} className="my-2.5 block" />
                    ))
                )
            }
        </InfiniteScroller>
    )
}

export default EventsTab
