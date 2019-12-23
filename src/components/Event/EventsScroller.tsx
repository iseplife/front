import {isToday, toDate} from "date-fns";
import {useTranslation} from "react-i18next";
import {EventList, EventPreview} from "../../data/event/types";
import {getEventsAround, getNextEvents, getPreviousEvents} from "../../data/event";
import React, {useEffect, useReducer} from "react";
import Loading from "../Loading";
import Event from "./Preview"

const PIXEL_BEFORE_REACHED = 50;
const INITIAL_LOADER: Loader = {loading: false, count: 0, over: false};
const INITIAL_STATE: EventScrollerState = {
    events: {},
    loading: true,
    up: INITIAL_LOADER,
    down: INITIAL_LOADER
};

type Loader = {
    count: number,
    over: boolean,
    loading: boolean
}

type EventsScrollerProps = {
    className?: string
    timestamp?: number
}

type ActionType =
    "FETCH_AROUND_INIT"
    | "FETCH_AROUND_COMPLETE"
    | "FETCH_UP_INIT"
    | "FETCH_UP_COMPLETE"
    | "FETCH_DOWN_INIT"
    | "FETCH_DOWN_COMPLETE";

type ReducerAction = {
    type: ActionType,
    events?: EventList,
    date?: Date
}

type EventScrollerState = {
    loading: boolean,
    events: EventList,
    up: Loader,
    down: Loader
}

const reducer: React.Reducer<EventScrollerState, ReducerAction> = (state, action): EventScrollerState => {
    switch (action.type) {
        case "FETCH_AROUND_INIT":
            return ({...state, loading: true});
        case "FETCH_AROUND_COMPLETE":
            return ({...state, loading: false, events: action.events || {}});
        case "FETCH_UP_INIT":
            return ({...state, up: {...state.up, loading: true}});
        case "FETCH_UP_COMPLETE":
            return ({
                ...state,
                events: {...state.events, ...action.events},
                up: {over: Object.keys(action.events || {}) && true, loading: false, count: ++state.up.count}

            });
        case "FETCH_DOWN_INIT":
            return ({...state, down: {...state.down, loading: true}});
        case "FETCH_DOWN_COMPLETE":
            return ({
                ...state,
                events: {...state.events, ...action.events},
                down: {over: Object.keys(action.events || {}) && true, loading: false, count: ++state.down.count,}
            });
    }
};

const EventsScroller: React.FC<EventsScrollerProps> = ({className, timestamp = Date.now()}) => {
    const {t} = useTranslation('date');
    const [{events, up, down}, dispatch] = useReducer(reducer, INITIAL_STATE);

    useEffect(() => {
        const fetchEvents = async () => {
            dispatch({type: 'FETCH_AROUND_INIT'});
            const res = await getEventsAround(new Date(timestamp));
            dispatch({type: 'FETCH_AROUND_COMPLETE', events: res.data});
        };
        fetchEvents().then(

        )
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
            main?.addEventListener('scroll',scrollerListener);
        return () => {
            main?.removeEventListener("scroll", scrollerListener);
        }
    }, []);

    useEffect(() => {
        if (!up.over && up.loading) {
            const fetchEvents = async () => {
                const previousDay = new Date(Number(Object.keys(events).pop()));
                const res = await getNextEvents(previousDay, up.count);
                dispatch({type: 'FETCH_UP_COMPLETE', events: res.data});
            };
            fetchEvents()
        }
    }, [up.loading]);

    useEffect(() => {
        if (!down.over && down.loading) {
            const fetchEvents = async () => {
                const previousDay = new Date(Number(Object.keys(events).shift()));
                const res = await getPreviousEvents(previousDay, up.count);
                dispatch({type: 'FETCH_DOWN_COMPLETE', events: res.data});
            };
            fetchEvents()
        }
    }, [down.loading]);

    return (
        <div id="events-list" className={`min-h-screen h-auto ${className}`}>
            <div className="h-12 mb-3">
                {!up.over && up.loading && <Loading size="3x"/>}
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
                                    <Event key={index} event={e}/>
                                ))}
                            </div>
                        </div>
                    )
                }
            )}
            <div className="h-12 mb-3">
                {!down.over && down.loading && <Loading size="3x"/>}
            </div>
        </div>
    )
};

export default EventsScroller;