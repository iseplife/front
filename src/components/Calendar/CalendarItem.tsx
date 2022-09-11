import { isToday } from "date-fns"
import React from "react"
import { HeaderProps, View } from "react-big-calendar"
import {EventTypeColor, EventTypeEmoji, EventTypeInvertColor} from "../../constants/EventType"
import { EventPreview } from "../../data/event/types"
import { _format } from "../../util"


export const EventWrapper: (view: View) => React.FC<{children: React.ReactElement, event: EventPreview}> = (view) => ({children, event}) => 
    <div
        style={{
            ...children.props.style,
            background: EventTypeColor[event.type],
            color: EventTypeInvertColor[event.type]
        }}
        onClick={children.props.onClick}
        className={`rounded-md px-1 py-0.5 font-medium sm:text-sm break-words cursor-pointer overflow-hidden block box-border ${view == "month" ? "whitespace-nowrap overflow-hidden text-[10px] leading-[11px] sm:text-xs" : "break-words text-xs"} ${view == "month" || !children.props.className.includes("-allday") && "absolute"}`}
    >
        <span className="drop-shadow hidden sm:contents">{EventTypeEmoji[event.type]}</span> {event.title}
    </div>

export const HeaderWrapper: (view: View) => React.FC<HeaderProps> =  (view) => ({date}) => 
    <div className={`w-full h-full capitalize sm:lowercase font-medium ${view == "month" && "py-1"}`}>
        <div className={`text-xs sm:hidden ${isToday(date) ? "text-indigo-400" : "text-neutral-500"}`}>
            {_format(date, "E").substring(0, 1)}
        </div>
        <div className={`${view == "month" ? "text-sm" : "text-xs"} hidden sm:block ${isToday(date) ? "text-indigo-400" : "text-neutral-500"}`}>
            {_format(date, "E").replace(".", "")}
        </div>
        {view != "month" && <div className={`text-base py-1 ${isToday(date) && "rounded-full px-2 bg-indigo-300"}`}>
            {_format(date, "d")}
        </div>}
    </div>
