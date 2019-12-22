import {isToday, toDate} from "date-fns";
import {useTranslation} from "react-i18next";
import {EventList, EventPreview} from "../../data/event/types";
import {getCurrentEvents, getEventsAround, getNextEvents,} from "../../data/event";
import React, {useEffect, useState} from "react";
import Loading from "../Loading";
import Event from "../Event"

const PIXEL_BEFORE_REACHED = 100;

interface EventsScrollerProps {
    className?: string
    timestamp?: number
}

interface Loader {
    fetching: boolean
    count: number
    over: boolean
}


const EventsScroller: React.FC<EventsScrollerProps> = ({className, timestamp = Date.now()}) => {
    const {t} = useTranslation('date');
    const [events, setEvents] = useState<EventList>({});
    const [down, setDown] = useState<Loader>({fetching: false, count: 0, over: false});
    const [up, setUp] = useState<Loader>({fetching: false, count: 0, over: false});

    useEffect(() => {
        async function fetchEvents() {
            const res = await getEventsAround(new Date(timestamp));
            setEvents(res.data);
        }
        fetchEvents().then(r => {
            console.log(r);
            setDown({fetching: false, count: 0, over: false});
            setUp({fetching: false, count: 0, over: false});
        });
    }, [timestamp]);

    useEffect(() => {
        const main = document.getElementById("main");
        if (main) {
            main.addEventListener('scroll', () => {
                // Trigger event loader when bottom of page is almost reached
                if (main.clientHeight + main.scrollTop >= main.scrollHeight - PIXEL_BEFORE_REACHED) {
                    setDown(p => {
                        p.fetching = true;
                        return p;
                    });
                }

                if (main.scrollTop <= PIXEL_BEFORE_REACHED) {
                    setUp(p => {
                        p.fetching = true;
                        return p;
                    });
                }
            })
        } else {
            console.error(`Cannot find elements with ids : events-page, events-list`)
        }

    }, []);

    useEffect(() => {
        if (down.fetching) {
            setEvents((e: EventList) => {
                const nextDay: Date = new Date(Number(Object.keys(e).splice(-1).pop()));
                return ({...e, ...getNextEvents(nextDay, down.count)});
            });
            setDown(p => {
                p.fetching = false;
                p.count++;
                return p;
            });
        }
    }, [down.fetching]);


    return (
        <div id="events-list" className={`min-h-screen h-auto ${className}`}>
            <div className="h-12 mb-3">
                {up.fetching && <Loading size="3x"/>}
            </div>
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
                {down.fetching && <Loading size="3x"/>}
            </div>
        </div>
    )
};

export default EventsScroller;