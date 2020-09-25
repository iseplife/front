import React from "react"
import {EventPreview as PreviewType} from "../../data/event/types"
import EventPreview from "./EventPreview"

type EventPreviewListProps = {
    events: PreviewType[]
}
const EventPreviewList: React.FC<EventPreviewListProps> = ({events}) => {
    return (
        <div className="flex md:flex-col flex-row justify-center items-end hidden-scroller w-full overflow-x-auto">
            {events.map(e => (
                <EventPreview key={e.id} event={e} />
            ))}
        </div>
    )
}

export default EventPreviewList