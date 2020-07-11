import React, {useMemo} from "react"
import {EventPreview as PreviewType} from "../../data/event/types"
import {Link} from "react-router-dom"
import {format} from "date-fns"

type EventProps = {
    event: PreviewType
    size?: "big" | "medium" | "small"
}
const EventPreview: React.FC<EventProps> = ({event, size = "medium"}) => {
	const date = useMemo(() => new Date(event.startsAt), [event.startsAt])

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
			<Link to={`/event/${event.id}`} className="m-2">
				<div className="text-gray-700 flex bg-white rounded shadow-md h-16 md:max-w-md max-w-lg mx-auto hover:text-gray-500">
					<div className="w-1/4 max-w-xs h-full text-center pb-1">
						<div className="font-bold text-3xl">
							{date.getDate()}
						</div>
						<div className="w-4/5 bg-gray-400 mx-auto" style={{height: 0.6}}/>
						<div className="uppercase text-xs font-semibold">
							{format(date, "MMM")}
						</div>
					</div>
					<div className="w-3/4 h-full" style={{
						backgroundImage: "url(\"/img/gala.png\")",
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