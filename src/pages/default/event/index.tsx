import React, {useCallback, useEffect, useRef, useState} from "react"
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

interface ParamTypes {
    id?: string
}

const Event: React.FC = () => {
    const {id} = useParams<ParamTypes>()
    const {t} = useTranslation("event")
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


    return event ?
        (
            <div className="h-full">
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
                        {format(event.start, "d MMM") + (event.end ? (" - " + format(event.end, "d MMM")) : "")}
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
                                {format(event.start, "HH:mm") + (event.end ? format(event.end, " - HH:mm") : "")}
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
            </div>
        ) : null
}

export default Event
