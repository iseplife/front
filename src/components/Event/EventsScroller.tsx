import {isToday, toDate} from "date-fns";
import {useTranslation} from "react-i18next";
import {EventList} from "../../data/event/types";
import {getCurrentEvents, getDayEvents} from "../../data/event";
import React, {useEffect, useState} from "react";
import Loading from "../Loading";

const PIXEL_BEFORE_REACHED = 100;

const EventsScroller: React.FC = () => {
    const {t} = useTranslation('date');
    const [events, setEvents] = useState<EventList>(getCurrentEvents());
    const [loadMore, setLoadMore] = useState(false);

    useEffect(() => {
        const list = document.getElementById('events-list');
        window.addEventListener('scroll', () => {
            // Trigger event loader when bottom of page is almost reached
            if (list && (list.clientHeight + list.offsetTop <= Math.ceil(window.scrollY) + window.innerHeight + PIXEL_BEFORE_REACHED)) {
                setLoadMore(true);
            }
        });
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (loadMore) {
                setEvents((e: EventList) => {
                    const nextDay: Date = new Date(Number(Object.keys(e).splice(-1).pop()));
                    return ({...e, ...getDayEvents(nextDay)});
                });
            }
            setLoadMore(false);
        }, 2000);
    }, [loadMore]);


    return (
        <div id="events-list" className="md:w-3/4 w-full h-64 min-h-screen h-auto" style={{height: "auto"}}>
            {Object.entries(events).map(([timestamp, events]) => {
                    const date: Date = toDate(Number(timestamp));
                    return (
                        <div key={timestamp} className="my-5 flex">
                            <div className="text-center font-dinotcb w-1/6">
                                <div className="">
                                    <div className="lowercase leading-none text-gray-600 text-4xl">
                                        {t(`day_names.${date.getDay()}`)}
                                    </div>
                                    <div
                                        className={`text-6xl leading-none ${isToday(date) ? "text-yellow-500" : "text-gray-400"}`}>
                                        {date.getDate()}
                                    </div>
                                    <div
                                        className={`text-3xl leading-none ${isToday(date) ? "text-yellow-500" : "text-gray-400"}`}>
                                        {t(`month_names.${date.getMonth()}`)}
                                    </div>
                                </div>
                                {isToday(date) &&
                                <div className="my-2 text-gray-500 leading-none border-t border-gray-300">
                                    Today
                                </div>
                                }
                            </div>
                            <div className="flex flex-row flex-wrap w-5/6">
                                {events.map((e: Event, index: number) => (
                                    <div key={index} className="bg-red-200 m-2" style={{height: 100, width: 250}}>

                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            )}
            <div className="h-12 mb-3">
                {loadMore && <Loading size="3x"/>}
            </div>
        </div>
    )
};

export default EventsScroller;