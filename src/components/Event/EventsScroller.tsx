import {isSameMonth, isThisMonth, isToday, parse} from "date-fns";
import {useTranslation} from "react-i18next";
import {EventMap, EventPreview, EventScrollerState, Loader, ReducerAction} from "../../data/event/types";
import {getEventsAround, getNextEvents, getPreviousEvents} from "../../data/event";
import React, {useEffect, useReducer} from "react";
import Loading from "../Loading";
import Event from "./Preview"
import WeekDay from "./WeekDay";


const PIXEL_BEFORE_REACHED = 50;
const INITIAL_LOADER: Loader = {loading: false, count: 0, over: false};
const INITIAL_STATE: EventScrollerState = {
    eventsMap: {},
    loading: true,
    up: INITIAL_LOADER,
    down: INITIAL_LOADER
};

const reducer: React.Reducer<EventScrollerState, ReducerAction> = (state, action): EventScrollerState => {
    switch (action.type) {
        case "FETCH_AROUND_INIT":
            return ({...state, loading: true});
        case "FETCH_AROUND_COMPLETE":
            return ({...state, loading: false, eventsMap: arrayToEventMap(action.events, {})});
        case "FETCH_UP_INIT":
            return ({...state, up: {...state.up, loading: true}});
        case "FETCH_UP_COMPLETE":
            return ({
                ...state,
                eventsMap: arrayToEventMap(action.events.content, state.eventsMap),
                up: {over: action.events.last, loading: false, count: ++state.up.count}
            });
        case "FETCH_DOWN_INIT":
            return ({...state, down: {...state.down, loading: true}});
        case "FETCH_DOWN_COMPLETE":
            return ({
                ...state,
                eventsMap: arrayToEventMap(action.events.content, state.eventsMap),
                down: {over: action.events.last, loading: false, count: ++state.down.count,}
            });
    }
};

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
}
const EventsScroller: React.FC<EventsScrollerProps> = ({className, timestamp = Date.now()}) => {
    const {t} = useTranslation(['common', 'date']);
    const [{eventsMap, up, down}, dispatch] = useReducer(reducer, INITIAL_STATE);

    useEffect(() => {
        dispatch({type: 'FETCH_AROUND_INIT'});
        getEventsAround(new Date(timestamp)).then(res => {
            dispatch({type: 'FETCH_AROUND_COMPLETE', events: res ? res.data : []});
        });
    }, [timestamp]);

    useEffect(() => {
        function scrollerListener(this: HTMLElement) {
            // Trigger event loader when bottom of page is almost reached
            if (this.scrollTop <= PIXEL_BEFORE_REACHED) {
                dispatch({type: "FETCH_UP_INIT"});
            }
            if (this.clientHeight + this.scrollTop >= this.scrollHeight - PIXEL_BEFORE_REACHED) {
                dispatch({type: "FETCH_DOWN_INIT"});
            }
        }

        const main = document.getElementById("main");
        main?.addEventListener('scroll', scrollerListener);
        return () => {
            main?.removeEventListener("scroll", scrollerListener);
        }
    }, []);

    useEffect(() => {
        if (!up.over && up.loading) {
            const year = Number(Object.keys(eventsMap).pop());
            const month = Number(Object.keys(eventsMap[year]).pop());
            const day = Number(Object.keys(eventsMap[year][month]).pop());
            getNextEvents(parse(`${year}-${(+month) + 1}-${day}`, 'y-M-d', new Date()), up.count).then(res =>
                dispatch({type: 'FETCH_UP_COMPLETE', events: res.data})
            );
        }
    }, [up.loading]);

    useEffect(() => {
        if (!down.over && down.loading) {
            const year = Number(Object.keys(eventsMap).shift());
            const month = Number(Object.keys(eventsMap[year]).shift());
            const day = Number(Object.keys(eventsMap[year][month]).shift());
            getPreviousEvents(parse(`${year}-${(+month) + 1}-${day}`, 'y-M-d', new Date()), down.count).then(res => {
                dispatch({type: 'FETCH_DOWN_COMPLETE', events: res.data});
            });
        }
    }, [down.loading]);

    return (
        <div id="events-list" className={`event-scroller relative min-h-screen h-auto ${className}`}>
            <div className="h-12 mb-3 text-center">
                {up.over ? <p>{t('end')}</p> : up.loading && <Loading size="3x"/>}
            </div>
            {Object.entries(eventsMap).map(([year, monthEvent]) => (
                <div key={year} className="my-5 mr-3 text-right font-dinotcb">
                    <div className="sticky -mb-12  text-gray-700 text-4xl top-0">{year}</div>
                    {Object.entries(monthEvent).map(([month, dayEvents]) => (
                        <div>
                            <div
                                className={`sticky md:mr-16 mr-12 pr-2 text-3xl md:mb-0 ${(new Date()).getMonth() === +month ? "text-yellow-500" : "text-gray-700"}`}
                                style={{top: "0.35rem"}}
                            >
                                {t(`date:month_names.${month}`)}
                            </div>
                            {Object.entries(dayEvents).map(([day, events]) => {
                                const date = parse(`${year}-${(+month) + 1}-${day}`, 'y-M-d', new Date());
                                return (
                                    <div className="flex md:flex-row flex-col md:my-4 my-16 md:mt-0 -mt-16">
                                        <WeekDay date={date} t={t}/>
                                        <div className="flex flex-row flex-wrap w-5/6 md:self-start self-center md:justify-start justify-center">
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
            ))}
            <div className="h-12 mb-3 text-center">
                {down.over ? <p>{t('end')}</p> : down.loading && <Loading size="3x"/>}
            </div>
        </div>
    )
};

export default EventsScroller;