import React, {useMemo} from "react"
import {EventProps, EventWrapperProps} from "react-big-calendar"
import {EventPreview} from "../data/event/types"
import {EventTypeColor} from "../constants/EventType"

export const CalendarEventWrapper: React.FC<EventWrapperProps<EventPreview>> = React.memo(({event, onClick }) => {
    const style = useMemo(() => (
        {
            padding: "0.1rem",
            opacity: 0.5,
            backgroundColor: `${EventTypeColor[event.type]}`,
            border: `2px solid ${EventTypeColor[event.type]}`
        }
    ), [event.type])

    return (
        <div className="rounded cursor-pointer" style={style} onClick={(e) => onClick(e)}>
            <CalendarEvent title={event.title} event={event} />
        </div>
    )
})
CalendarEventWrapper.displayName = "CalendarEventWrapper"

export const CalendarEvent: React.FC<EventProps<EventPreview>> = ({title, event}) => {
    const verticalBarStyle = useMemo(() => (
        {
            width: 3,
            height: 20,
            backgroundColor: EventTypeColor[event.type]
        }
    ), [event.type])

    return (
        <div className="flex items-center text-gray-800">
            <div className="mx-1 rounded" style={verticalBarStyle}/>
            {title}
        </div>
    )
}