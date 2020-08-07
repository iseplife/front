import React, {useEffect, useMemo, useState} from "react"
import {getEvent} from "../../data/event"
import {Event} from "../../data/event/types"
import Loading from "../Common/Loading"
import {Map, Marker, TileLayer} from "react-leaflet"
import {differenceInDays} from "date-fns"
import {_format} from "../../util"
import {
    ClockCircleOutlined,
    EuroOutlined
} from "@ant-design/icons"

type ModalEventProps = {
    id: number
}
const ModalEventContent: React.FC<ModalEventProps> = ({id}) => {
    const [event, setEvent] = useState<Event | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const [start, end] = useMemo(() => (
        event ?
            [new Date(event.start), new Date(event.end)] :
            [new Date(), new Date()]
    ), [event])
    const formatedDates = useMemo(() => {
        if (event) {
            const pattern = differenceInDays(start, end) > 1 ? "d LLLL" : "HH:mm"
            return _format(start, pattern) + " - " + _format(end, pattern)
        }
        return "xx:xx - xx:xx"
    }, [start, end])

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

                <div className="w-8/12">
                    {event.description}
                </div>
                <div className=" w-4/12 text-gray-700 uppercase font-bold">
                    <ul>
                        <li className="flex items-center ">
                            <ClockCircleOutlined className="mr-2"/>
                            {formatedDates}
                        </li>
                        {event.price &&
                        <li className="flex items-center">
                            <EuroOutlined className="mr-2"/>
                            {event.price.toFixed(2)}
                        </li>
                        }
                    </ul>
                    <Map
                        className="mt-5 rounded h-32"
                        center={[51.505, -0.09]}
                        zoom={13}
                    >
                        <TileLayer
                            id="mapbox/streets-v11"
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                            accessToken="pk.eyJ1Ijoid2FydGh5IiwiYSI6ImNrNmRzMmdvcDA5ejczZW52M2JqZWxpMzEifQ.LXqt7uNt4fHA9m4UiQofSA"
                        />
                        <Marker position={[51.505, -0.09]}/>
                    </Map>

                </div>
            </div>
            : <p>Erreur de chargement...</p>
}

export default ModalEventContent