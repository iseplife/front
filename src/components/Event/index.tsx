import React from "react";
import {EventPreview} from "../../data/event/types";
import {Link} from "react-router-dom";

type EventProps = {
    event: EventPreview
}

const Event: React.FC<EventProps> = ({event}) => (
    <Link to={`/event/${event.id}`}>
        <div  className="bg-red-200 m-2 rounded shadow-md" style={{height: 100, width: 200}}>

        </div>
    </Link>
);

export default Event;