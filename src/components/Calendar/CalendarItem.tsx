import React from "react"
import {EventTypeColor} from "../../constants/EventType"


export const EventWrapper: React.FC<any> = ({children, event}) => {
    return React.cloneElement(React.Children.only(children), {
        style: {
            ...children.props.style,
            border: `2px solid ${EventTypeColor[event.type]}`
        },
    })
}

