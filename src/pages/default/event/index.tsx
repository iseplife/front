import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {useParams, useHistory, Link} from "react-router-dom"
import {Marker, TileLayer, Map} from "react-leaflet"
import {getEvent, getEventChildren, getEventGalleries} from "../../../data/event"

import {Event as EventType, EventPreview as PreviewType} from "../../../data/event/types"
import "./Event.css"
import {Avatar} from "antd"
import {useTranslation} from "react-i18next"
import Feed from "../../../components/Feed"
import {GalleryPreview} from "../../../data/gallery/types"
import {mediaPath} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import {toggleSubscription} from "../../../data/feed"
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
        </>) : null
}

export default Event
