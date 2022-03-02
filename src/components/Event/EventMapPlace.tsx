import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useCallback, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Event } from "../../data/event/types"

interface EventMapPlaceProps {
    event: Event
    phone?: boolean
}
const EventMapPlace: React.FC<EventMapPlaceProps> = ({ event, phone }) => {
    const [placeShortOpen, setPlaceShortOpen] = useState(true)
    const [placeShortWidth, setPlaceShortWidth] = useState(0)
    const [placeShortAnimation, setPlaceShortAnimation] = useState(false)
    const placeShort = useRef<HTMLDivElement>(null)
    const togglePlaceShort = useCallback(() => {
        placeShort?.current && placeShortOpen && setPlaceShortWidth(placeShort.current.clientWidth)
        requestAnimationFrame(() => {
            setPlaceShortOpen(open => !open)
            setPlaceShortAnimation(true)
        })
    }, [placeShortOpen])

    const { t } = useTranslation("event")

    const position = useMemo(() =>
        event?.location
        ||
        event?.position?.label.split(" ").filter((val, index, array) =>
            event.position?.postcode != val && array.length != index + 1
        ).join(" ") || t("event:event")
    , [event?.position])
    const subPosition = useMemo(() =>
        event?.position ? event?.location?.length ? `${event.position.street}, ${event.position.city}` : `${event.position.postcode}, ${event.position.city}` : t("event:online")
    , [event?.position])

    const place = useMemo(() => <div className="flex items-center sm:text-black">
        <div>
            <div className="font-semibold">
                {position}
            </div>
            <div className="font-normal text-neutral-500 sm:text-xl">
                {subPosition}
            </div>
        </div>
        {event?.position?.coordinates && <FontAwesomeIcon icon={faExternalLinkAlt} className="text-base text-black/20 mr-0 ml-auto sm:ml-4" />}
    </div>, [position, subPosition, event?.position?.coordinates])

    const bigPlace = useMemo(() => {
        return event?.position?.coordinates ?
            <Link to={{ pathname: `https://maps.google.com/?q=${event?.position?.label}` }} target="_blank">
                {place}
            </Link>
            : place
    }, [place, event?.position?.coordinates, event?.position?.label])

    return phone ?
        <div className={"flex items-center sm:hidden px-4 py-3 shadow-sm text-base rounded-lg bg-white transition-colors mt-1 sm:mt-5 " + (event?.position?.coordinates && "hover:bg-neutral-50")}>
            {event?.position?.coordinates ?
                <Link to={{ pathname: `https://maps.google.com/?q=${event?.position?.label}` }} target="_blank" className="w-full">
                    {place}
                </Link>
                : place}
        </div>
        :
        <div className="flex bg-white/40 shadow-sm backdrop-blur rounded-lg text-3xl absolute top-1/2 -translate-y-1/2 z-[1000]">
            <div className="bg-white/40 px-2 grid place-items-center cursor-pointer shadow-sm" onClick={togglePlaceShort}>
                <div className={"h-0.5 rounded-full w-2.5 bg-neutral-400 transition-transform duration-300 " + (placeShortOpen || "rotate-90")}></div>
            </div>
            <div ref={placeShort} className={"px-4 py-2 overflow-hidden whitespace-nowrap " + (placeShortAnimation && "transition-all duration-300 ") + (placeShortOpen || "px-0")} style={{
                maxWidth: placeShortOpen && (placeShortWidth || 9999) || 0
            }}>
                {bigPlace}
            </div>
        </div>
}
export default EventMapPlace