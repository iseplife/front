import React, {useEffect, useRef, useState} from "react"
import {useParams, useHistory, Link} from "react-router-dom"
import {format} from "date-fns"
import {Map, Marker, TileLayer} from "react-leaflet"
import {getEvent, getEventChildren, getEventGalleries} from "../../../data/event"

import {Event as EventType, EventPreview as PreviewType} from "../../../data/event/types"
import "./Event.css"
import {Avatar} from "antd"
import {useTranslation} from "react-i18next"
import Feed from "../../../components/Feed"
import EventPreview from "../../../components/Event/EventPreview"
import {
    TeamOutlined,
    EuroOutlined,
    UserOutlined,
    UpOutlined,
    DownOutlined,
    LockOutlined,
    UnlockOutlined
} from "@ant-design/icons"
import GalleryModalForm from "../../../components/Gallery/Form/GalleryModalForm"
import {GalleryPreview} from "../../../data/gallery/types"
import GalleryCard from "../../../components/Gallery/GalleryCard"
import {mediaPath} from "../../../util";
import {AvatarSizes} from "../../../constants/MediaSizes";


const Event: React.FC = () => {
    const {id} = useParams()
    const {t} = useTranslation("event")
    const history = useHistory()
    const [event, setEvent] = useState<EventType | undefined>()

    const eventsRef = useRef<HTMLInputElement>(null)
    const [subevents, setSubevents] = useState<PreviewType[]>([])
    const [eventsVisible, setEventVisible] = useState<boolean>(false)

    const [galleries, setGalleries] = useState<GalleryPreview[]>([])

    const descriptionRef = useRef<HTMLInputElement>(null)
    const [descVisible, setDescVisible] = useState<boolean>(false)

    useEffect(() => {
        if (!id || !+id) {
            history.push("/")
        } else {
            getEvent(+id).then(res => {
                setEvent(res.data)
            })
        }
    }, [id])

    useEffect(() => {
        if (event) {
            getEventChildren(event.id).then(res => {
                setSubevents(res.data)
            })
            getEventGalleries(event.id).then(res => {
                setGalleries(res.data.content)
            })
        }
    }, [event])

    return event === undefined ? null :
        (
            <div className="h-full">
                <div className="md:h-56 h-24 bg-red-200 relative" style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(247, 250, 252, 0.3), rgba(247, 250, 252)), url(${mediaPath(event.image || "img/static/default-cover.png")})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                }}>
                    <Link
                        to={`/club/${event.club.id}`}
                        className="absolute flex items-center text-gray-700 font-bold"
                        style={{left: 0, bottom: 5}}
                    >
                        <Avatar
                            icon={<UserOutlined/>}
                            src={mediaPath(event.club.logoUrl, AvatarSizes.THUMBNAIL)}
                            className="cursor-pointer mx-3"
                        />
                        {event.club.name}
                    </Link>
                    <div
                        className="absolute text-lg text-gray-700 font-bold uppercase mx-3"
                        style={{right: 0, bottom: 5}}
                    >
                        {format(new Date(event.start), "d MMM") + (event.end ? (" - " + format(new Date(event.end), "d MMM")) : "")}
                    </div>
                </div>
                <div className="mx-auto p-3 w-full">
                    <div className="flex md:flex-row flex-col ">
                        <div className="md:w-1/6 w-full md:order-1 order-3">
                            {subevents.length != 0 &&
                            <div className="mt-5 text-center">
                                <div
                                    className="flex flex-row items-baseline md:justify-start justify-center font-dinotcb text-gray-500 text-lg ml-2 md:text-left text-center md:cursor-default cursor-pointer"
                                    style={{marginBottom: -5}}
                                    onClick={() => {
                                        if (eventsRef.current) {
                                            setEventVisible(!eventsRef.current?.classList.toggle("h-0"))
                                        }
                                    }}>
                                    <span>{t("event") + "s"}</span>
                                    {eventsVisible
                                        ? <UpOutlined className="md:hidden block mx-2"/>
                                        : <DownOutlined className="md:hidden block mx-2"/>
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
                                <span className="font-dinotcb text-gray-500 text-lg ">
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

                        <div className="flex items-center md:w-4/6 w-full flex-col md:order-2 order-1">
                            <div
                                className="z-10 leading-none event-title md:bg-white md:shadow-md md:p-5 rounded-full uppercase font-bold text-center font-dinotcb">
                                {event.title}
                            </div>
                            <div className="font-dinotcb text-4xl text-center">
                                {format(new Date(event.start), "HH:mm") + (event.end ? format(new Date(event.end), " - HH:mm") : "")}
                            </div>
                            <div className="text-xs text-gray-600 text-center">
                                {event.location}
                            </div>

                            <div
                                className="flex flex-col justify-center mt-5 text-xs text-gray-600 cursor-pointer"
                                onClick={() => {
                                    if (descriptionRef.current) {
                                        setDescVisible(!descriptionRef.current?.classList.toggle("h-32"))
                                    }
                                }}
                            >
                                <div ref={descriptionRef} className="h-32 overflow-hidden">
                                    {event.description && event.description.split("\n").map((s, idx) =>
                                        <span key={idx}>{s} <br/></span>
                                    )}
                                </div>
                                {descVisible ? <UpOutlined className="mx-auto"/> : <DownOutlined className="mx-auto"/>}
                            </div>
                        </div>
                        <div
                            className="h-32 md:w-1/6 w-full h-full md:order-3 order-2 bg-white rounded shadow p-2 mt-3">
                            <div className="flex items-baseline justify-around text-lg font-bold">
                                <div
                                    className="flex items-center"
                                    title={event.closed ? "Evenement ouvert" : "Evenement privé"}
                                >
                                    {event.closed ? <LockOutlined/> : <UnlockOutlined/>}
                                </div>
                                <div className="flex items-center">
                                    <TeamOutlined className="mr-2"/> 14
                                </div>
                                <div className="flex items-center">
                                    <EuroOutlined className="mr-2"/>
                                    {event.price ? event.price.toFixed(2) : t("free")}
                                </div>
                            </div>

                            <Map
                                className="mt-5 rounded md:h-64 h-48"
                                center={[51.505, -0.09]}
                                zoom={13}
                            >
                                <TileLayer
                                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                                    id="mapbox/streets-v11"
                                    accessToken="pk.eyJ1Ijoid2FydGh5IiwiYSI6ImNrNmRzMmdvcDA5ejczZW52M2JqZWxpMzEifQ.LXqt7uNt4fHA9m4UiQofSA"
                                />
                                <Marker position={[51.505, -0.09]}/>
                            </Map>
                        </div>
                    </div>

                    <Feed id={event.feed} className="mx-auto my-3 md:w-3/6 w-full"/>
                </div>
            </div>
        )

}

export default Event