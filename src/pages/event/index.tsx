import React, {useEffect, useState} from "react";
import {
    useParams,
    useHistory, Link
} from "react-router-dom";
import {format} from "date-fns";
import {Map, Marker, TileLayer} from 'react-leaflet'
import {getEvent} from "../../data/event";
import {getUser} from "../../data/security";
import {Event as EventType} from "../../data/event/types";
import './Event.css';
import {Avatar} from "antd";
import {Icon} from "antd/es";
import {useTranslation} from "react-i18next";


const Event: React.FC = () => {
    const {id} = useParams();
    const {t} = useTranslation("event");
    const history = useHistory();
    const [event, setEvent] = useState<EventType | undefined>();
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        if (!id || !+id) {
            history.push("/");
        } else {
            getEvent(+id).then(r => {
                setEvent(r.data);
                if (getUser().clubsPublisher.includes(r.data.club.id)) {
                    setAdmin(true);
                }
            })
        }
    }, [id]);

    return event === undefined ? null :
        (<div>
                <div className="md:h-56 h-24 bg-red-200 relative" style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(247, 250, 252, 0.3), rgba(247, 250, 252)), url("/img/gala.png")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: "top",
                }}>
                    <Link to={`/club/${event.club.id}`}
                          className="absolute flex items-center text-gray-700 font-bold"
                          style={{left: 0, bottom: 5}}
                    >
                        <Avatar icon="user" src={event.club.logoUrl} className="cursor-pointer mx-3"/> {event.club.name}
                    </Link>
                </div>

                <div className="mx-auto p-3 container flex md:flex-row flex-col ">
                    <div className="md:w-1/6 w-full md:order-1 order-3">

                    </div>

                    <div className="flex items-center md:w-4/6 w-full flex-col md:order-2 order-1">
                        <div
                            className="z-10 leading-none event-title md:bg-white md:shadow-md md:p-5 rounded-full uppercase font-bold text-center font-dinotcb">
                            {event.title}
                        </div>
                        <div className="font-dinotcb text-4xl text-center">
                            {format(event.startsAt, "HH:mm") + " " + (event.endsAt ? format(event.endsAt, "HH:mm") : "")}
                        </div>
                        <div className="text-xs text-gray-600 text-center">
                            {event.location}
                        </div>
                    </div>
                    <div className="md:w-1/6 w-full h-full md:order-3 order-2 bg-white rounded shadow p-2 mt-3">
                        <div className="flex items-baseline justify-around text-lg font-bold">
                            <div className="flex items-center" title={event.closed ? "Evenement ouvert": "Evenement privé"}>
                                <Icon type={event.closed ? "lock" : "unlock"}/>
                            </div>
                            <div className="flex items-center">
                                <Icon type="team" className="mr-2"/> 14
                            </div>
                            <div className="flex items-center">
                                <Icon type="euro" className="mr-2"/>
                                { event.price ? event.price.toFixed(2) : t("free")}
                            </div>
                        </div>

                        <Map className="mt-5 rounded md:block hidden" style={{height: 250}}
                             center={[51.505, -0.09]}
                             zoom={13}>
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
            </div>
        );

};

export default Event;