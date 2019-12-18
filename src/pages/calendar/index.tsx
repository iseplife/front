import React from 'react';
import EventsScroller from "../../components/Event/EventsScroller";
import Calendar from 'react-calendar'

const Events: React.FC = () => {
    return (
        <div id="events-page" className="flex px-4 flex-row">
            <EventsScroller className="md:w-3/4 w-full" />
            <div className="mt-5 md:w-1/4 w-1 md:block hidden">
               <Calendar className="side-calendar"/>
            </div>
        </div>
    )
};

export default Events;