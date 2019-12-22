import React, {useState} from 'react';
import EventsScroller from "../../components/Event/EventsScroller";
import Calendar from 'react-calendar'
import {useTranslation} from "react-i18next";

const Events: React.FC = () => {
    const {i18n} = useTranslation();
    const [date, setDate] = useState<Date|Date[]>(new Date());
    return (
        <div id="events-page" className="flex px-4 flex-row">
            <EventsScroller className="md:w-3/4 w-full" timestamp={Array.isArray(date) ? date[0].getTime(): date.getTime() }/>
            <div className="mt-5 md:w-1/4 w-1 md:block hidden">
                <Calendar className="side-calendar shadow-md rounded"
                          next2Label={null}
                          prev2Label={null}
                          value={date}
                          onChange={setDate}
                          locale={i18n.language}
                />
            </div>
        </div>
    )
};

export default Events;