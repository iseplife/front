import React, {useCallback, useMemo, useReducer, useState} from "react";
import {Calendar, dateFnsLocalizer, View} from 'react-big-calendar'
import { Radio } from 'antd';
import {IconFA} from "../../../components/Common/IconFA";
import {EventFilter, EventPreview, FilterList, FilterReducerAction} from "../../../data/event/types";
import SideCalendar from "../../../components/Calendar/SideCalendar";
import {useTranslation} from "react-i18next";
import { add, parse, format } from 'date-fns'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import {enUS, fr} from 'date-fns/locale'

import 'react-big-calendar/lib/css/react-big-calendar.css';


const initFilter = (events: EventPreview[]): EventFilter => {
    const feeds = Array.from(new Set(events.map(e => e.target)));
    return (
        {
            feeds: feeds.reduce((acc: FilterList, feed) => {
                acc[feed] = true;
                return acc
            }, {}),
            types: events.reduce((acc: FilterList, {type}) => {
                if(!acc[type])
                    acc[type] = true;
                return acc
            }, {}),
            "publishedOnly": false
        });
};

const reducer: React.Reducer<EventFilter, FilterReducerAction> = (filter, action) => {
    const newFilter = {...filter};
    switch (action.type) {
        case "TOGGLE_FEED":
            newFilter.feeds[action.name] = !filter.feeds[action.name];
            break;
        case "TOGGLE_TYPE":
            newFilter.types[action.name] = !filter.types[action.name];
            break;
        case "TOGGLE_PUBLISHED":
            newFilter.publishedOnly = !filter.publishedOnly;
            break;
        case "INIT_FILTER":
            return initFilter(action.events);

    }
    return newFilter;
};

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
    const [filter, setFilter] = useReducer(reducer, initFilter([]));
    const [date, setDate] = useState<Date>(new Date());
    const [view, setView] = useState<View>("month");
    const {t, i18n} = useTranslation("event");

    const dateTitle: string = useMemo(() => {
        let formatPattern: string;
        switch (view) {
            case "agenda":
            case "month":
            case "work_week":
            case "week":
                formatPattern = "MMMM yyyy"
                break;
            case "day":
                formatPattern = "dd MMMM yyyy"
                break;
        }
        // @ts-ignore
        return format(date, formatPattern, {locale: locales[i18n.language]})
    }, [date, view, i18n.language]);

    const incrementDate = useCallback(() => {
        setDate(d => add(d, {
            months: view === "month" ? 1: 0,
            weeks: view === "week" ? 1: 0,
            days: view === "day" ? 1: 0,
        }))
    },[view]);

    const decrementDate = useCallback(() => {
        setDate(d => add(d, {
            months: view === "month" ? -1: 0,
            weeks: view === "week" ? -1: 0,
            days: view === "day" ? -1: 0,
        }))
    }, [view]);

    return (
        <div className="h-full flex flex-row flex-wrap bg-gray-100">
            <SideCalendar className="md:w-1/5 w-full" date={date} handleDate={(d) => setDate(d)} filter={filter} handleFilter={setFilter}/>
            <div className="flex flex-col md:w-4/5 w-full h-screen p-3" style={{maxHeight: 600}}>
                <div className="h-16 w-full flex justify-between items-center">
                    <div className="flex items-baseline">
                        <h1 className="text-2xl font-extrabold my-auto text-gray-800">
                            {dateTitle}
                        </h1>
                        <IconFA name="fa-arrow-left" className="my-auto mx-2 cursor-pointer text-gray-600" onClick={decrementDate}/>
                        <IconFA name="fa-arrow-right" className="my-auto mx-2 cursor-pointer text-gray-600" onClick={incrementDate} />
                    </div>
                    <Radio.Group value="large" onChange={(e) => setView(e.target.value)}>
                        <Radio.Button value="day">{t("day")}</Radio.Button>
                        <Radio.Button value="week">{t("week")}</Radio.Button>
                        <Radio.Button value="month">{t("month")}</Radio.Button>
                    </Radio.Group>
                </div>
                <Calendar
                    date={date}
                    onNavigate={(d) => setDate(d)}
                    culture={i18n.language}
                    localizer={localizer}
                    events={[]}
                    startAccessor="start"
                    endAccessor="end"
                    toolbar={false}
                    defaultView="month"
                    onView={(v) => setView(v)}
                    view={view}
                />
            </div>
        </div>
    );
};

export default Events