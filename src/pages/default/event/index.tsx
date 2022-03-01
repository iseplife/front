import React, {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react"
import {useParams, useHistory, Link} from "react-router-dom"
import {format} from "date-fns"
import {Marker, TileLayer, Map} from "react-leaflet"
import {getEvent, getEventChildren, getEventGalleries} from "../../../data/event"

import {Event as EventType, EventPreview as PreviewType} from "../../../data/event/types"
import "./Event.css"
import {Avatar} from "antd"
import {useTranslation} from "react-i18next"
import Feed from "../../../components/Feed"
import EventPreview from "../../../components/Event/EventPreview"
import GalleryModalForm from "../../../components/Gallery/Form/GalleryModalForm"
import {GalleryPreview} from "../../../data/gallery/types"
import GalleryCard from "../../../components/Gallery/GalleryCard"
import {mediaPath} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import {toggleSubscription} from "../../../data/feed"
import EventEditorModal from "../../../components/Event/EventEditorModal"
import EventDescription from "../../../components/Event/EventDescription"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faBell, faBellSlash, faUser} from "@fortawesome/free-regular-svg-icons"
import {faChevronDown, faChevronUp, faEuroSign, faLock, faUnlock, faUsers} from "@fortawesome/free-solid-svg-icons"
import StudentAvatar from "../../../components/Student/StudentAvatar"
import GalleriesPreview from "../../../components/Gallery/GalleriesPreview"
import GalleriesTab from "../../../components/Gallery/GalleriesTab"
import TabsSwitcher from "../../../components/Common/TabsSwitcher"

interface ParamTypes {
    id?: string
}

const Event: React.FC = () => {
    const {id} = useParams<ParamTypes>()
    const {t} = useTranslation(["event", "gallery"])
    const history = useHistory()
    const [event, setEvent] = useState<EventType | undefined>()

    const eventsRef = useRef<HTMLInputElement>(null)
    const [subevents, setSubevents] = useState<PreviewType[]>([])
    const [eventsVisible, setEventVisible] = useState<boolean>(false)

    const [galleries, setGalleries] = useState<GalleryPreview[]>([])

    const handleSubscription = useCallback(() => {
        if (event) {
            toggleSubscription(event.feed).then(res => {
                setEvent({
                    ...event,
                    subscribed: res.data
                })
            })
        }
    }, [event])

    useEffect(() => {
        if (!id || !+id) {
            history.push("/")
        } else {
            getEvent(+id).then(res => {
                setEvent(res.data)
                getEventChildren(res.data.id).then(res => {
                    setSubevents(res.data)
                })
                getEventGalleries(res.data.id).then(res => {
                    setGalleries(res.data.content)
                })
            })
        }
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

    const description = useMemo(() =>
        <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white my-5">
            <span className="text-neutral-900 font-semibold text-base">Description</span>
            <span>
                L’AS, la Winter et le CUI te donnent rendez-vous ce lundi au Casimodo pour leur premier afterwork de l’année 🎿🏆🦅<br />
                — INFOS —<br />
                Lundi 20 septembre 2021<br />
                19h-2h<br />
                — ACCÈS —<br />
                Ligne 4, RER B, RER C —&gt; Saint-Michel<br />
                Ligne 10 —&gt; Maubert-Mutualité<br />
                — TARIFS —<br />
                Happy hour jusqu’à minuit 🤩<br />
                Pinte 3,5€<br />
                Cocktails 6€<br />
                Pop-corn offert<br />
                Margarita 6€<br />
                Frites 6€<br />
                On vous attend nombreux 🔥<br />
            </span>
        </div>, [])

    return event ?
        (<>
            <div className="w-full md:h-64 h-28 relative hidden sm:block">
                <Map className="w-full h-full" center={event.coordinates || [48.8453227,2.3280245]} zoom={13}>
                    <TileLayer
                        url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                        id="mapbox/streets-v11"
                        accessToken="pk.eyJ1Ijoid2FydGh5IiwiYSI6ImNrNmRzMmdvcDA5ejczZW52M2JqZWxpMzEifQ.LXqt7uNt4fHA9m4UiQofSA"
                    />
                    {event.coordinates && (
                        <Marker position={event.coordinates}/>
                    )}
                </Map>
                <div className="container mx-auto px-4">
                    <div className="flex bg-white/40 shadow-sm backdrop-blur rounded-lg text-3xl absolute top-1/2 -translate-y-1/2 z-[99999]">
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
                            <div className="font-semibold">
                                Bal de la Marine
                            </div>
                            <div className="font-normal text-neutral-500 text-xl">
                                Port de Suffren, Paris
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto mt-4">
                <div className="flex items-center px-4">
                    <div className="w-16 h-16 text-3xl sm:w-20 sm:h-20 sm:text-4xl rounded-md bg-white shadow-sm overflow-hidden font-medium relative flex flex-col flex-shrink-0">
                        <div className="bg-red-500 w-full h-5 flex-shrink-0"></div>
                        <div className="grid place-items-center h-full">3</div>
                    </div>
                    <div className="ml-4">
                        <div className="text-red-600 uppercase text-base md:text-lg font-bold leading-4 mb-1 md:mb-0">
                            JEUDI DE 23:00 À 05:00
                        </div>
                        <div className="text-2xl md:text-3xl font-bold leading-6">
                            Winter - Risoul
                        </div>
                    </div>
                </div>
                <div className="mt-4 sm:mt-3 grid mx-auto sm:grid-cols-3 lg:grid-cols-4">
                    <div className="flex-1 mx-4 sm:mt-0">
                        <Link to={`/club/${event.club.id}`}>
                            <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white hover:bg-neutral-50 transition-colors my-5">
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
                        <div className="lg:hidden">
                            {description}
                        </div>
                        <GalleriesPreview className="sm:hidden lg:block" elementId={event.id} getGalleriesCallback={getEventGalleries} />
                    </div>
                    <TabsSwitcher
                        className="mt-5 mx-4 md:mx-10 sm:col-span-2 lg:hidden"
                        currentTab={tab}
                        setCurrentTab={setTabFactory}
                        tabs={tabs}
                    />
                    <div className="hidden lg:block mx-4 md:mx-10 sm:col-span-2">
                        {feed}
                    </div>
                    <div className="flex-1 mx-4 sm:mt-0 hidden lg:block">
                        {description}
                    </div>
                </div>
            </div>
        </>
    /*<div className="h-full">
                <div className="md:h-56 h-24 relative" style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(243, 244, 246, 0.3), rgba(243, 244, 246)), url(${mediaPath(event.image || "img/static/default-cover.png")})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                }}>
                    {event.hasRight && (
                        <div className="absolute" style={{top: 5, right: 5}}>
                            <EventEditorModal values={event} onSubmit={setEvent}/>
                        </div>
                    )}

                    <Link
                        to={`/club/${event.club.id}`}
                        className="absolute flex items-center text-gray-700 font-bold"
                        style={{left: 0, bottom: 5}}
                    >
                        <Avatar
                            icon={<FontAwesomeIcon icon={faUser}/>}
                            src={mediaPath(event.club.logoUrl, AvatarSizes.THUMBNAIL)}
                            className="cursor-pointer mx-3"
                        />
                        {event.club.name}
                    </Link>
                    <div
                        className="absolute text-lg text-gray-700 font-bold uppercase mx-3"
                        style={{right: 0, bottom: 5}}
                    >
                        {format(event.startsAt, "d MMM") + (event.endsAt ? (" - " + format(event.endsAt, "d MMM")) : "")}
                        <span className="mx-2 hover:text-gray-500 cursor-pointer" onClick={handleSubscription}>
                            <FontAwesomeIcon icon={event.subscribed ? faBellSlash: faBell} />
                        </span>
                    </div>
                </div>
                <div className="mx-auto p-3 w-full">
                    <div className="flex md:flex-row flex-col ">
                        <div className="md:w-1/6 w-full md:order-1 order-3">
                            {subevents.length !== 0 &&
                            <div className="mt-5 text-center">
                                <div
                                    className="flex flex-row items-baseline md:justify-start justify-center text-gray-500 text-lg ml-2 md:text-left text-center md:cursor-default cursor-pointer"
                                    style={{marginBottom: -5}}
                                    onClick={() => {
                                        if (eventsRef.current) {
                                            setEventVisible(!eventsRef.current?.classList.toggle("h-0"))
                                        }
                                    }}>
                                    <span>{t("event") + "s"}</span>
                                    {eventsVisible
                                        ? <FontAwesomeIcon icon={faChevronUp} className="md:hidden block mx-2"/>
                                        : <FontAwesomeIcon icon={faChevronDown} className="md:hidden block mx-2"/>
                                    }
                                </div>
                                <div ref={eventsRef} className="flex flex-col md:h-auto h-0 overflow-hidden mt-2">
                                    {subevents.map((se, i) => (
                                        <EventPreview key={i} event={se}/>
                                    ))}
                                </div>
                            </div>
                            }
                            {galleries &&
                            <div className="mt-5 ml-2">
                                <span className="text-gray-700 text-lg ">
                                    {t("gallery")}
                                </span>
                                <div className="flex flex-col md:h-auto h-0 overflow-hidden mt-2">
                                    {galleries.map(g => (
                                        <GalleryCard key={g.id} gallery={g}/>
                                    ))}
                                </div>
                                <GalleryModalForm feed={event.feed} onSubmit={(g) => setGalleries(prevState => [...prevState, g])}/>
                            </div>
                            }

                        </div>

                        <div className="flex items-center md:w-4/6 w-full flex-col md:order-2 order-1 px-3">
                            <div
                                className="z-10 leading-none event-title md:bg-white md:shadow-md md:p-5 rounded-full uppercase font-bold text-center">
                                {event.title}
                            </div>
                            <div className="text-4xl text-center text-gray-700">
                                {format(event.startsAt, "HH:mm") + (event.endsAt ? format(event.endsAt, " - HH:mm") : "")}
                            </div>
                            <div className="text-xs text-gray-600 text-center">
                                {event.location}
                            </div>

                            <EventDescription description={event.description}/>

                            <Feed id={event.feed} className="w-full mx-auto my-3"/>
                        </div>
                        <div className="h-32 md:w-1/6 w-full h-full md:order-3 order-2 bg-white rounded shadow p-2 mt-3">
                            <div className="flex items-baseline justify-around text-lg font-bold">
                                <div
                                    className="flex items-center"
                                    title={event.closed ? "Evenement ouvert" : "Evenement privé"}
                                >
                                    {event.closed ? <FontAwesomeIcon icon={faLock} /> : <FontAwesomeIcon icon={faUnlock} />}
                                </div>
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faUsers} className="mr-2" /> ??
                                </div>
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faEuroSign} className="mr-2"/>
                                    {event.price ? event.price.toFixed(2) : t("free")}
                                </div>
                            </div>

                            <Map className="mt-5 rounded md:h-64 h-48" center={event.coordinates || [48.8453227,2.3280245]} zoom={13}>
                                <TileLayer
                                    url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                                    id="mapbox/streets-v11"
                                    accessToken="pk.eyJ1Ijoid2FydGh5IiwiYSI6ImNrNmRzMmdvcDA5ejczZW52M2JqZWxpMzEifQ.LXqt7uNt4fHA9m4UiQofSA"
                                />
                                {event.coordinates && (
                                    <Marker position={event.coordinates}/>
                                )}
                            </Map>
                        </div>
                    </div>
                </div>
            </div>*/
        ) : null
}

export default Event
