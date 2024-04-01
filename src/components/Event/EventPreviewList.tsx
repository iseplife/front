import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { UIEvent, useCallback, useState } from "react"
import { useEffect } from "react"
import { useRef } from "react"
import {EventPreview as PreviewType} from "../../data/event/types"
import EventPreview from "./EventPreview"

type EventPreviewListProps = {
    events: PreviewType[]
}
const EventPreviewList: React.FC<EventPreviewListProps> = ({ events }) => {
    
    const [scroll, setScroll] = useState(0)
    const [maxScroll, setMaxScroll] = useState(0)
    const scrollCallback = useCallback((event: UIEvent<HTMLDivElement>) =>
        setScroll((event.target as HTMLElement).scrollLeft)
    , [])
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (ref.current)
            setMaxScroll(ref.current.scrollWidth - ref.current.clientWidth)
    }, [ref?.current, scroll])

    const scrollLeft = useCallback(() =>
        ref?.current?.scrollTo({
            left: scroll - 200,
            behavior: "smooth",
        })
    , [scroll, ref?.current])
    const scrollRight = useCallback(() =>
        ref?.current?.scrollTo({
            left: scroll + 200,
            behavior: "smooth",
        })
    , [scroll, ref?.current])

    return (
        <div className="grid rounded-lg overflow-hidden relative sm:mb-4">
            <div ref={ref} onScroll={scrollCallback} className="grid grid-flow-col sm:grid-flow-row relative flex-row hidden-scroller w-full max-w-[calc(100vw-16px*2)] sm:max-w-full overflow-x-auto m-0 gap-2.5 pl-1 sm:pl-0">
                {events.map(e => (
                    <EventPreview key={e.id} event={e} />
                ))}
            </div>
            <div onClick={scrollRight} className={"sm:hidden z-20 cursor-pointer absolute right-0 bg-black/[12%] backdrop-blur-sm grid place-items-center w-6 h-full text-lg transition-opacity " + ((maxScroll <= 5 || scroll > maxScroll - 10) && "opacity-0 pointer-events-none")}>
                <FontAwesomeIcon icon={faAngleRight} />
            </div>
            <div onClick={scrollLeft} className={"sm:hidden z-20 cursor-pointer absolute left-0 bg-black/[12%] backdrop-blur-sm grid place-items-center w-6 h-full text-lg transition-opacity " + (scroll < 10 && "opacity-0 pointer-events-none")}>
                <FontAwesomeIcon icon={faAngleLeft} />
            </div>
        </div>
    )
}

export default EventPreviewList
