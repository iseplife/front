import React, {useEffect, useMemo, useState} from "react"
import {getEvent} from "../../data/event"
import {Event, EventPreview} from "../../data/event/types"
import Loading from "../Common/Loading"
import {Map, Marker, TileLayer} from "react-leaflet"
import {differenceInDays} from "date-fns"
import {_format, positionToMarker} from "../../util"
import Tag from "../Common/Tag"
import {useTranslation} from "react-i18next"
import {EventTypeColor, EventTypeEmoji} from "../../constants/EventType"
import {Link} from "react-router-dom"
import {Avatar} from "antd"
import {faEuroSign, faSignOutAlt} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faClock, faUser} from "@fortawesome/free-regular-svg-icons"

type ModalEventHeaderProps = {
    event: EventPreview
}
export const ModalEventHeader: React.FC<ModalEventHeaderProps> = ({event}) => {
    const {t} = useTranslation("event")
    return (
        <Link to={`/event/${event.id}`} className="text-gray-700 font-bold text-2xl m-0 mx-auto flex items-center">
            <span
                className="text-white inline-block rounded shadow m-1 px-2 py-1 text-xs font-semibold"
                style={{backgroundColor: EventTypeColor[event.type]}}>
                {`${EventTypeEmoji[event.type]} ${t(`type.${event.type}`)}`}
            </span>
            <span className="ml-1">{event.title}</span>
        </Link>
    )
}


type ModalEventProps = {
    id: number
}
export const ModalEventContent: React.FC<ModalEventProps> = ({id}) => {
    const {t} = useTranslation("event")
    const [event, setEvent] = useState<Event | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const [start, end] = useMemo((): [Date, Date] => (
        event ? [event.startsAt, event.endsAt] : [new Date(), new Date()]
    ), [event])

    const formatedDates = useMemo(() => {
        if (event) {
            const pattern = differenceInDays(end, start) >= 1 ? "d LLLL" : "HH:mm"
            return _format(start, pattern) + " - " + _format(end, pattern)
        }
        return "xx:xx - xx:xx"
    }, [event, start, end])

    const marker = useMemo(() => positionToMarker(event?.position),[event])

    useEffect(() => {
        setLoading(true)
        getEvent(id).then(res => {
            setEvent(res.data)
        }).finally(() => setLoading(false))
    }, [id])

    return loading ?
        <div className="flex items-center justify-center">
            <Loading size="3x"/>
        </div>
        : event ?
            <div className="h-full flex flex-row">

                <div className="flex flex-col w-8/12">
                    <div>
                        {event.targets.length ?
                            event.targets.map(t => (
                                <Tag key={t.id} selected={true} onClick={() => null}>
                                    {t.name}
                                </Tag>
                            )) :
                            <Tag selected={true} onClick={() => null}>
                                Public
                            </Tag>
                        }
                    </div>
                    <span className="mt-2">
                        {event.description}
                    </span>
                </div>
                <div className=" w-4/12 text-gray-700 uppercase font-bold">
                    <ul>
                        {event.club &&
                        <Link
                            to={`/club/${event.club.id}`}
                            className="flex items-center text-gray-700 font-bold"
                        >
                            <Avatar
                                icon={<FontAwesomeIcon icon={faUser}/>}
                                src={event.club.logoUrl}
                                className="cursor-pointer mr-1 -ml-2"
                            />
                            {event.club.name}
                        </Link>
                        }
                        <li className="flex items-center ">
                            <FontAwesomeIcon icon={faClock} className="mr-2"/>
                            {formatedDates}
                        </li>
                        {event.price &&
                        <li className="flex items-center">
                            <FontAwesomeIcon icon={faEuroSign} className="mr-2"/>
                            {event.price.toFixed(2)} €
                        </li>
                        }
                        {event.ticketURL &&
                        <li className="lowercase text-sm">
                            <a href={event.ticketURL} target="_blank" rel="noopener noreferrer">
                                {t("ticket_url")} <FontAwesomeIcon icon={faSignOutAlt}/>
                            </a>
                        </li>
                        }
                    </ul>
                    <Map
                        className="mt-5 rounded h-32"
                        center={marker ?? [51.505, -0.09]}
                        zoom={13}
                    >
                        <TileLayer
                            id="mapbox/streets-v11"
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                            accessToken="pk.eyJ1Ijoid2FydGh5IiwiYSI6ImNrNmRzMmdvcDA5ejczZW52M2JqZWxpMzEifQ.LXqt7uNt4fHA9m4UiQofSA"
                        />
                        {marker && <Marker position={marker}/> }
                    </Map>
                </div>
            </div>
            : <p>Erreur de chargement...</p>
}
