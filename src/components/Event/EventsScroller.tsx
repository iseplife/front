import {isToday, toDate} from "date-fns";
import {useTranslation} from "react-i18next";
import {EventList, EventPreview} from "../../data/event/types";
import {getCurrentEvents, getDayEvents} from "../../data/event";
import React, {useEffect, useState} from "react";
import Loading from "../Loading";
import Event from "../Event"

const PIXEL_BEFORE_REACHED = 100;
interface EventsScrollerProps {
    className?: string
}



const EventsScroller: React.FC<EventsScrollerProps> = ({className}) => {
    const {t} = useTranslation('date');
    const [events, setEvents] = useState<EventList>(getCurrentEvents());
    const [loadMore, setLoadMore] = useState(false);

    useEffect(() => {
        const page = document.getElementById('events-page');
        const list = document.getElementById('events-list');
        window.addEventListener('scroll', () => {
            // Trigger event loader when bottom of page is almost reached
            if(page && list){
                if (list.clientHeight + list.offsetTop <= Math.ceil(page.scrollTop) + page.clientHeight + PIXEL_BEFORE_REACHED) {
                    setLoadMore(true);
                }
            }else {
                console.error(`Cannot find elements with ids : events-page, events-list`)
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
        <div id="events-list" className={`min-h-screen h-auto ${className}`}>
            {Object.entries(events).map(([timestamp, events]) => {
                    const date: Date = toDate(Number(timestamp));
                    return (
                        <div id={timestamp} key={timestamp} className="my-5 flex">
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
                                {events.map((e: EventPreview, index: number) => (
                                    <Event key={index} data={e}/>
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