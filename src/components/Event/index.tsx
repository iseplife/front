import React from "react";
import {EventPreview} from "../../data/event/types";

interface EventProps {
    data: EventPreview
}

const Event: React.FC<EventProps> = ({data}) => (
    <div  className="bg-red-200 m-2 rounded shadow-md" style={{height: 100, width: 200}}>

    </div>
);

export default Event;