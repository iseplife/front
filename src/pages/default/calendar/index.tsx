import React from "react";
import {Calendar, dateFnsLocalizer} from 'react-big-calendar'
import {useTranslation} from "react-i18next";
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import {enUS, fr} from 'date-fns/locale'

import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
    'fr': fr,
    'en': enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const Events: React.FC = () => {
    const {i18n} = useTranslation();

    return (
        <div>
            <div className="h-16 w-full">

            </div>
            <div className="flex flex-row flex-wrap">


                <div className="md:w-4/5 w-full h-screen p-3" style={{maxHeight: 600}}>
                    <Calendar
                        culture={i18n.language}
                        localizer={localizer}
                        events={[]}
                        startAccessor="start"
                        endAccessor="end"
                        toolbar={false}
                        defaultView="month"
                    />
                </div>
                <div className="md:w-1/5 w-full">

                </div>
            </div>
        </div>
    );
};

export default Events