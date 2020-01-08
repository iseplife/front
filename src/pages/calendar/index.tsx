import React, {useEffect, useReducer, useState} from 'react';
import EventsScroller from "../../components/Event/EventsScroller";
import Calendar from 'react-calendar'
import {useTranslation} from "react-i18next";
import {EventFilter, EventMap, EventPreview, FilterList, FilterReducerAction} from "../../data/event/types";
import EventsFilter from "../../components/Event/EventsFilter";
import Types from "../../constants/EventTypes"
import {loaderCallback} from "../../components/Common/InfiniteScroller";
import {getEventsAround, getNextEvents, getPreviousEvents} from "../../data/event";

const initFilter = (events: EventPreview[]): EventFilter => {
    const feeds = Array.from(new Set(events.map(e => e.target)));
    return (
        {
            feeds: feeds.reduce((acc: FilterList, feed: string) => {
                acc[feed] = true;
                return acc
            }, {}),
            types: Types.reduce((acc: FilterList, type: string) => {
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


const arrayToEventMap = (events: EventPreview[], initial: EventMap): EventMap =>
    events.reduce((acc: EventMap, e: EventPreview): EventMap => {
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

const Events: React.FC = () => {
    const {t, i18n} = useTranslation('common');
    const [date, setDate] = useState<Date | Date[]>(new Date());
    const [events, setEvents] = useState<EventPreview[]>([]);
    const [filter, setFilter] = useReducer(reducer, initFilter([]));
    const [loading, setLoading] = useState<boolean>(true);
    const [filteredEvents, setFilteredEvents] = useState<EventMap>({});

    const filterFn = (e: EventPreview) => (
        filter.feeds[e.target] && filter.types[e.type] && (e.published || !filter.publishedOnly)
    );

    /**
     * Date update
     * e.g. first load/ calendar date clicked
     */
    useEffect(() => {
        setLoading(true);
        getEventsAround(Array.isArray(date) ? date[0] : date).then(res => {
            setEvents(() => res.data);
            setFilter({type: "INIT_FILTER", events: res.data});
            setLoading(false);
        });
    }, [date]);

    /**
     * Filter Update
     */
    useEffect(() => {
        setFilteredEvents(
            arrayToEventMap(events.filter(filterFn), {})
        );
    }, [filter]);

    const getNext: loaderCallback = async (count) => {
        const evt = events.pop();
        if (evt) {
            const res = await getNextEvents(new Date(evt.startsAt), count);
            setEvents(prevState => ([...prevState, ...res.data.content]));
            setFilteredEvents(prevState =>
                arrayToEventMap(res.data.content.filter(filterFn), prevState)
            );

            return res.data.last
        }
        return true
    };
    const getPrevious: loaderCallback = async (count) => {
        const evt = events.shift();
        if (evt) {
            const res = await getPreviousEvents(new Date(evt.startsAt), count);
            setEvents(prevState => [...res.data.content, ...prevState]);
            setFilteredEvents(prevState =>
                arrayToEventMap(res.data.content.filter(filterFn), prevState)
            );

            return res.data.last
        }
        return true;
    };

    return (
        <div id="events-page" className="flex px-4 flex-row h-full">
            <EventsScroller
                callback={[getNext, getPrevious]}
                events={filteredEvents}
                loading={loading}
                timestamp={Array.isArray(date) ? date[0] : date}
            />
            <div className="mt-5 md:w-1/4 w-1 md:block hidden fixed right-0">
                <Calendar
                    className="side-calendar shadow-md rounded"
                    next2Label={null}
                    prev2Label={null}
                    value={date}
                    onChange={(date) => {
                        setDate(date)
                    }}
                    locale={i18n.language}
                />
                <div>
                    <h5 className="text-color text-gray-600 font-dinotcb uppercase"> {t('filters')}</h5>
                    <EventsFilter filter={filter} filterFn={setFilter}/>
                </div>
            </div>
        </div>
    )
};

export default Events;