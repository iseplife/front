import React, {CSSProperties, useMemo} from "react"
import {EventProps} from "react-big-calendar"
import {EventPreview} from "../../data/event/types"
import {EventTypeColor} from "../../constants/EventType"


// `any` is used here as the typing is incorrect/outdated
export const CalendarEventWrapper: React.FC<any> = React.memo(({event, continuesPrior, continuesAfter, onSelect}) => {
    const style = useMemo((): CSSProperties[] => [
        {
            width: 3,
            height: 20,
            backgroundColor: EventTypeColor[event.type]
        }, {
            padding: "0.1rem",
            border: `2px solid ${EventTypeColor[event.type]}`,
            borderLeft: continuesPrior ? "unset": `2px solid ${EventTypeColor[event.type]}`,
            borderRight: continuesAfter ? "unset": `2px solid ${EventTypeColor[event.type]}`,
        }
    ], [event.type])

    return (
        <div
            className={`flex items-center cursor-pointer ${!continuesPrior && "rounded-l"} ${!continuesAfter && "rounded-r"}`}
            onClick={(e) => onSelect(event, e)}
            style={style[1]}
        >
            { !continuesPrior && <div className="mx-1 rounded" style={style[0]}/> }
            <CalendarEvent title={event.title} event={event} />
        </div>
    )
})
CalendarEventWrapper.displayName = "CalendarEventWrapper"

export const CalendarEvent: React.FC<EventProps<EventPreview>> = ({title}) => {
    return (
        <div className="text-gray-800">
            {title}
        </div>
    )
}