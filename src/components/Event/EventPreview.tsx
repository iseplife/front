import React from "react"
import {EventPreview as PreviewType} from "../../data/event/types"
import {Link} from "react-router-dom"
import {format} from "date-fns"
import {mediaPath} from "../../util"

type EventProps = {
    event: PreviewType
    size?: "big" | "medium" | "small"
}
const EventPreview: React.FC<EventProps> = ({event, size = "medium"}) => {
    switch (size) {
        case "big":
            return (
                <Link to={`/event/${event.id}`}>
                    <div className="bg-red-200 m-2 rounded shadow-md" style={{height: 100}}>
                        {event.id}
                    </div>
                </Link>
            )
        case "medium":
            return (
                <Link to={`/event/${event.id}`} className="m-2 w-full max-w-sm">
                    <div className="text-gray-700 flex bg-white rounded shadow-md h-16 w-full hover:text-gray-500">
                        <div className="w-1/4 max-w-xs h-full text-center pb-1">
                            <div className="font-bold text-3xl">
                                {event.startsAt.getDate()}
                            </div>
                            <div className="uppercase text-xs font-semibold">
                                {format(event.startsAt, "MMM")}
                            </div>
                        </div>
                        <div className="w-3/4 h-full" style={{
                            backgroundImage: `url("${mediaPath(event.cover || "img/static/default-cover.png")}")`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}>

                        </div>
                    </div>
                </Link>
            )
        case "small":
            return (
                <Link to={`/event/${event.id}`}>
                    <div className="bg-red-200 m-2 rounded shadow-md" style={{height: 100, width: 200}}>
                        {event.id}
                    </div>
                </Link>
            )
    }
}

export default EventPreview