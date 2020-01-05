import {parse} from "date-fns";
import {useTranslation} from "react-i18next";
import {EventFilter, EventMap, EventPreview} from "../../data/event/types";
import {getEventsAround, getNextEvents, getPreviousEvents} from "../../data/event";
import React, {useEffect, useState} from "react";
import Event from "./Preview"
import WeekDay from "./WeekDay";
import InfiniteScroller, {loaderCallback} from "../Common/InfiniteScroller";
import Loading from "../Loading";

const arrayToEventMap = (events: EventPreview[], initial: EventMap): EventMap => events.reduce((acc: EventMap, e: EventPreview): EventMap => {
    e.startsAt = new Date(e.startsAt);
    const year = e.startsAt.getFullYear();
    const month = e.startsAt.getMonth();
    const day = e.startsAt.getDate();
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = {};
    if (!acc[year][month][day]) {
        acc[year][month][day] = [e];
    } else {
        acc[year][month][day].push(e);
    }
    return acc;
}, initial);


type EventsScrollerProps = {
    className?: string
    timestamp?: number
    filter: EventFilter
}
const EventsScroller: React.FC<EventsScrollerProps> = ({filter, className = "", timestamp = Date.now()}) => {
    const {t} = useTranslation('date');
    const [eventsMap, setEventsMap] = useState<EventMap>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        getEventsAround(new Date(timestamp)).then(res => {
            setEventsMap(() => arrayToEventMap(res.data, {}))
        });
        setLoading(false);
    }, [timestamp]);


    const getNext: loaderCallback = async (count) => {
        const year = Number(Object.keys(eventsMap).pop());
        const month = Number(Object.keys(eventsMap[year]).pop());
        const day = Number(Object.keys(eventsMap[year][month]).pop());

        const res = await getNextEvents(parse(`${year}-${(+month) + 1}-${day}`, 'y-M-d', new Date()), count);
        setEventsMap(prevState => arrayToEventMap(res.data.content, prevState));

        return res.data.last
    };
    const getPrevious: loaderCallback = async (count) => {
        const year = Number(Object.keys(eventsMap).shift());
        const month = Number(Object.keys(eventsMap[year]).shift());
        const day = Number(Object.keys(eventsMap[year][month]).shift());

        const res = await getPreviousEvents(parse(`${year}-${(+month) + 1}-${day}`, 'y-M-d', new Date()), count);
        setEventsMap(prevState => arrayToEventMap(res.data.content, prevState));

        return res.data.last
    };


    return (
        <InfiniteScroller watch="BOTH" callback={[getNext, getPrevious]} className={`event-scroller ${className}`}>
            {loading ?
                <Loading size="5x" style={{margin: "25%"}} />
                : (Object.entries(eventsMap).map(([year, monthEvent]) => (
                    <div key={year} className="my-5 mr-3 text-right font-dinotcb">
                        <div className="sticky -mb-12  text-gray-700 text-4xl top-0">{year}</div>
                        {Object.entries(monthEvent).map(([month, dayEvents]) => (
                            <div key={month}>
                                <div
                                    className={`sticky md:mr-16 mr-12 pr-2 text-3xl md:mb-0 ${(new Date()).getMonth() === +month ? "text-yellow-500" : "text-gray-700"}`}
                                    style={{top: "0.35rem"}}
                                >
                                    {t(`month_names.${month}`)}
                                </div>
                                {Object.entries(dayEvents).map(([day, events]) => {
                                    const date = parse(`${year}-${(+month) + 1}-${day}`, 'y-M-d', new Date());
                                    return (
                                        <div key={`${(+month) + 1}-${day}`}
                                             className="flex md:flex-row flex-col md:my-4 my-16 md:mt-0 -mt-16">
                                            <WeekDay date={date} t={t}/>
                                            <div
                                                className="flex flex-row flex-wrap w-5/6 md:self-start self-center md:justify-start justify-center">
                                                {events.map((e: EventPreview, index: number) => (
                                                    <Event key={index} event={e}/>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                )))
            }
        </InfiniteScroller>
    )
};

export default EventsScroller;