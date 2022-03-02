import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {useParams, useHistory, Link} from "react-router-dom"
import {Marker, TileLayer, Map} from "react-leaflet"
import {getEvent, getEventGalleries} from "../../../data/event"

import {Event as EventType} from "../../../data/event/types"
import "./Event.css"
import {Avatar, Divider, Skeleton} from "antd"
import {useTranslation} from "react-i18next"
import Feed from "../../../components/Feed"
import {mediaPath} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import GalleriesPreview from "../../../components/Gallery/GalleriesPreview"
import GalleriesTab from "../../../components/Gallery/GalleriesTab"
import TabsSwitcher from "../../../components/Common/TabsSwitcher"
import { format } from "date-fns"
import { getLocaleFromTranslation } from "../../../constants/TranslationLocale"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faExternalLinkAlt, faPencilAlt } from "@fortawesome/free-solid-svg-icons"
import EventEditorModal from "../../../components/Event/EventEditorModal"

interface ParamTypes {
    id?: string
}

const Event: React.FC = () => {
    const {id} = useParams<ParamTypes>()
    const {t, i18n} = useTranslation(["event", "gallery"])
    const history = useHistory()
    const [event, setEvent] = useState<EventType | undefined>()

    useEffect(() => {
        if (!id || !+id)
            history.push("/")
        else
            getEvent(+id).then(res =>
                setEvent(res.data)
            )
    }, [id])

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
    
    const feed = useMemo(() => (<Feed id={event?.feed} loading={!event?.feed}></Feed>), [event?.feed])

    const tabs = useMemo(() => ({
        "Publications": feed,
        [t("gallery:galleries")]: event?.id ? <GalleriesTab elementId={event?.id} getGalleriesCallback={getEventGalleries} /> : <></>,
    }), [event?.feed])
    const [tab, setTab] = useState<number>(0)
    const setTabFactory = useCallback((tab: number) => () => setTab(tab), [])


    const [seeAll, setSeeAll] = useState(false)
    const toggleSeeAll = useCallback(() => setSeeAll(see => !see), [])

    const descLengthThrottle = 350

    const generateDescription = useCallback((phone: boolean) => {
        const skeletonLength = Array(8).fill(0).map(() => 80 + Math.random() * 70)

        const tooLong = event?.description.length ?? 0 > descLengthThrottle
        let totalLength = 0
        
        return <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white my-5">
            <span className="text-neutral-900 font-semibold text-base">Description</span>
            {event ?
                <span>
                    {
                        event.description.split("\n").map((val, index, array) => {
                            if (totalLength >= descLengthThrottle) return

                            if (val == "<spacer>")
                                return <Divider className="my-4" />
                            
                            if (!seeAll && phone) {
                                if (totalLength + val.length > descLengthThrottle)
                                    val = val.substring(0, descLengthThrottle - totalLength)
                                totalLength += val.length
                            }

                            return index && array[index - 1] != "<spacer>" ? <><br /> {val}</> : val
                        })
                    }
                    {tooLong && !seeAll && phone &&
                        <label className="ml-1 font-semibold hover:underline cursor-pointer text-gray-500" onClick={toggleSeeAll}>
                            {t("event:see_more")}
                        </label>
                    }
                </span>
                :
                skeletonLength.map((length, index) =>
                    <Skeleton key={index} title paragraph={{ rows: 1, width: length }} />
                )
            }
        </div>
    }, [event?.description, seeAll])

    const sideDescription = useMemo(() => generateDescription(false), [generateDescription])
    const phoneDescription = useMemo(() => generateDescription(true), [generateDescription])

    const coordinates = useMemo(() => event?.position?.coordinates.split(";").map(v => +v) as [number, number], [event?.position?.coordinates])

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
    
    const date = useMemo(() => {
        if (event) {
            const locale = { locale: getLocaleFromTranslation(i18n.language) }
            const startMs = event.startsAt.getTime()
            const fullDay = event.startsAt.getFullYear() == new Date().getFullYear() ? "d LLL" : "d LLL yyyy"
            if (event.endsAt.getTime() - startMs <= 24 * 60 * 60 * 1000) {// It lasts for less than a day
                const delayDays = (startMs - new Date().getTime()) / 1000 / 60 / 60 / 24
                return t("event:date.same_day_this_week", {
                    day: delayDays <= 1 ? t("event:date.today") : format(event.startsAt, "EEEE" + (delayDays > 7 ? ` ${fullDay}` : "") , locale),
                    start: format(event.startsAt, "HH:mm", locale),
                    end: format(event.endsAt, "HH:mm", locale),
                })
            }else 
                return t("event:date.diff_days", {
                    start: format(event.startsAt, fullDay + " HH:mm", locale),
                    end: format(event.endsAt, fullDay + " HH:mm", locale),
                })
        }
    }, [event?.startsAt, event?.endsAt])

    const day = useMemo(() => event?.startsAt.getDate(), [event?.startsAt])

    const participateButton = useMemo(() => {
        const button = <button className="px-3 py-2 rounded shadow-sm bg-indigo-400 text-white text-base font-medium cursor-pointer hover:shadow-md transition-shadow">
            {event?.price && <>{event?.price}€ - </>}{t("event:participate")}
        </button>
        return event?.ticketURL ?
            <Link to={{ pathname: event?.ticketURL }} target="_blank">
                {button}
            </Link>
            : button
    }, [event?.price])

    const phonePlace = useMemo(() => {
        const place = <div className={"flex items-center sm:hidden px-4 py-3 shadow-sm rounded-lg bg-white transition-colors mt-1 sm:mt-5 "+(coordinates && "hover:bg-neutral-50")}>
            <div>
                <div className="font-semibold text-base">
                    { position }
                </div>
                <div className="font-normal text-neutral-500 text-base">
                    { subPosition }
                </div>
            </div>
            {coordinates && <FontAwesomeIcon icon={faExternalLinkAlt} className="text-base text-black/20 ml-auto mr-0" />}
        </div>
        return coordinates ?
            <Link to={{ pathname: `https://maps.google.com/?q=${event?.position?.label}` }} target="_blank">
                {place}
            </Link>
            : place
    }, [coordinates, event?.position?.label])
    const bigPlace = useMemo(() => {
        const place = <div className="flex items-center text-black">
            <div>
                <div className="font-semibold">
                    { position }
                </div>
                <div className="font-normal text-neutral-500 text-xl">
                    { subPosition }
                </div>
            </div>
            {coordinates && <FontAwesomeIcon icon={faExternalLinkAlt} className="text-base ml-4 text-black/20" />}
        </div>
        return coordinates ?
            <Link to={{ pathname: `https://maps.google.com/?q=${event?.position?.label}` }} target="_blank">
                {place}
            </Link>
            : place
    }, [coordinates, event?.position?.label])
    return event ?
        (<>
            <div className="w-full md:h-64 h-28 relative hidden sm:block">
                <Map className="w-full h-full" center={coordinates || [48.8453227,2.3280245]} zoom={14}>
                    <TileLayer
                        url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                        id="mapbox/streets-v11"
                        accessToken="pk.eyJ1Ijoid2FydGh5IiwiYSI6ImNrNmRzMmdvcDA5ejczZW52M2JqZWxpMzEifQ.LXqt7uNt4fHA9m4UiQofSA"
                    />
                    {coordinates && (
                        <Marker position={coordinates}/>
                    )}
                </Map>
                <div className="container mx-auto px-4">
                    <div className="flex bg-white/40 shadow-sm backdrop-blur rounded-lg text-3xl absolute top-1/2 -translate-y-1/2 z-[1000]">
                        <div className="bg-white/40 px-2 grid place-items-center cursor-pointer shadow-sm" onClick={togglePlaceShort}>
                            <div className={"h-0.5 rounded-full w-2.5 bg-neutral-400 transition-transform duration-300 " + (placeShortOpen || "rotate-90")}></div>
                        </div>
                        <div
                            ref={placeShort}
                            className={"px-4 py-2 overflow-hidden whitespace-nowrap " + (placeShortAnimation && "transition-all duration-300 ") + (placeShortOpen || "px-0")}
                            style={{
                                maxWidth: (placeShortOpen && (placeShortWidth || 9999) || 0)
                            }}
                        >
                            {bigPlace}
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto mt-4">
                <div className="flex items-center px-4">
                    <div className="w-16 h-16 text-3xl sm:w-20 sm:h-20 sm:text-4xl rounded-md bg-white shadow-sm overflow-hidden font-medium relative flex flex-col flex-shrink-0">
                        <div className="bg-red-500 w-full h-5 flex-shrink-0"></div>
                        <div className="grid place-items-center h-full">{ day }</div>
                    </div>
                    <div className="ml-4">
                        <div className="text-red-600 uppercase text-base md:text-lg font-bold leading-4 mb-1 md:mb-0">
                            { date }
                        </div>
                        <div className="text-2xl md:text-3xl font-bold leading-6">
                            { event.title }
                        </div>
                    </div>
                    <div className="ml-auto mr-0 hidden md:block">{participateButton}</div>
                </div>
                <div className="w-full px-4 mt-5 flex">
                    <div className="md:hidden ml-auto mr-0">{participateButton}</div>
                </div>
                <div className="mt-4 sm:mt-3 grid mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div className="flex-1 mx-4 sm:mt-0">
                        <Link to={`/club/${event.club.id}`}>
                            <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white hover:bg-neutral-50 transition-colors my-5 mt-1 sm:mt-5">
                                <div className="flex items-center font-normal">
                                    <Avatar
                                        src={mediaPath(event.club.logoUrl, AvatarSizes.THUMBNAIL)}
                                        size="large"
                                        className="hover:shadow-outline mr-1"
                                    />
                                    <div className="mx-2 mb-0 font-semibold text-md text-neutral-900 text-lg">{ event.club.name }</div>
                                </div>
                            </div>
                        </Link>
                        
                        <div className="sm:hidden"> {phoneDescription} </div>
                        { phonePlace }
                        <div className="hidden sm:block lg:hidden"> {sideDescription} </div>
                        
                        <GalleriesPreview className="sm:hidden lg:block" elementId={event.id} getGalleriesCallback={getEventGalleries} />
                    </div>
                    <TabsSwitcher
                        className="mt-5 mx-4 md:mx-10 md:col-span-2 lg:hidden"
                        currentTab={tab}
                        setCurrentTab={setTabFactory}
                        tabs={tabs}
                    />
                    <div className="hidden lg:block mx-4 md:mx-10 md:col-span-2">
                        {feed}
                    </div>
                    <div className="flex-1 mx-4 sm:mt-0 hidden lg:block">
                        {sideDescription}
                    </div>
                </div>
            </div>
            
            {event.hasRight && (
                <div
                    className="absolute grid place-items-center top-2 right-2 sm:top-5 sm:right-5 z-[1000] ml-2 text-xl w-10 h-10 rounded-full bg-black/[25%] hover:bg-black/[35%] backdrop-blur-sm transition-colors cursor-pointer group"
                >
                    <EventEditorModal values={event} onSubmit={setEvent}/>
                </div>
            )}
        </>) : null
}

export default Event
