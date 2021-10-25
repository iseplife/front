import React from "react"
import {EventPreview as PreviewType} from "../../data/event/types"
import {Link} from "react-router-dom"
import {format} from "date-fns"

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
                <Link to={`/event/${event.id}`} className="w-full max-w-sm text-gray-700 hover:text-gray-500">
                    <div
                        title={event.title}
                        className="flex bg-white rounded shadow-md h-16 w-full px-1"
                    >
                        <div className="w-1/5 max-w-xs my-auto text-center pb-1">
                            <div className="font-bold text-3xl">
                                {event.startsAt.getDate()}
                            </div>
                            <div className="uppercase text-xs font-semibold">
                                {format(event.startsAt, "MMM")}
                            </div>
                        </div>
                        <span className="flex-1 text-left text-2xl ml-1 my-3 font-bold truncate">
                            {event.title}
                        </span>
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