import React from 'react';
import EventsScroller from "../../components/Event/EventsScroller";

const Events: React.FC = () => {
    return (
        <div className="flex h-full px-4 flex-row">
            <EventsScroller/>
            <div className="bg-blue-200 md:w-1/4 w-1 md:block hidden">
                Calendar
            </div>
        </div>
    )
};

export default Events;