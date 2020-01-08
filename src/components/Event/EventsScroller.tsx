import {parse} from "date-fns";
import {useTranslation} from "react-i18next";
import {EventMap, EventPreview} from "../../data/event/types";
import React from "react";
import Event from "./Preview"
import WeekDay from "./WeekDay";
import InfiniteScroller, {ScrollerCallback} from "../Common/InfiniteScroller";
import Loading from "../Loading";


type EventsScrollerProps = {
    events: EventMap,
    timestamp: Date
    loading: boolean
    callback: ScrollerCallback,
}
const EventsScroller: React.FC<EventsScrollerProps> = ({events, callback, loading, timestamp}) => {
    const {t} = useTranslation('date');

    return (
        <InfiniteScroller watch="BOTH" callback={callback} className="event-scroller md:w-3/4 w-full">
            {loading ?
                <Loading size="5x" style={{margin: "25%"}}/>
                : (Object.entries(events).map(([year, monthEvent]) => (
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
                                        <div id={date.getTime().toString()}
                                             key={`${(+month) + 1}-${day}`}
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