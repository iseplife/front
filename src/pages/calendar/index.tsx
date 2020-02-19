import React, {useCallback, useEffect, useReducer, useState} from 'react';
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
        const dt = new Date(e.startsAt);

        const year = dt.getFullYear();
        const month = dt.getMonth();
        const day = dt.getDate();
        if (!acc[year]) acc[year] = {};
        if (!acc[year][month]) acc[year][month] = {};
        if (!acc[year][month][day]) {
            acc[year][month][day] = [e];
        } else {
            acc[year][month][day].push(e);
        }
        return acc;
    }, initial);

type APIDates = {
    prev: number,
    curr: Date,
    next: number
}

const Events: React.FC = () => {
    const {t, i18n} = useTranslation('common');
    const [dates, setDates] = useState<APIDates>({prev: new Date().getTime(), curr: new Date(), next: new Date().getTime()});
    const [events, setEvents] = useState<EventPreview[]>([]);
    const [filter, setFilter] = useReducer(reducer, initFilter([]));
    const [loading, setLoading] = useState<boolean>(true);
    const [filteredEvents, setFilteredEvents] = useState<EventMap>({});
    const [start, setStart] = useState<Date|undefined>();

    const filterFn = useCallback((e: EventPreview) => (
        filter.feeds[e.target] && filter.types[e.type] && (e.published || !filter.publishedOnly)
    ), [filter]);

    /**
     * Date update
     * e.g. first load/ calendar date clicked
     */
    useEffect(() => {
        setLoading(true);
        getEventsAround(dates.curr.getTime()).then(({data}) => {
            console.log(data);
            setEvents(data);
            const firstEvt = data.pop();
            const lastEvt = data.shift();
            setDates({
                prev: firstEvt ? firstEvt.startsAt: dates.curr.getTime(),
                curr: dates.curr,
                next: lastEvt ? lastEvt.startsAt: dates.curr.getTime()
            });
            setFilter({type: "INIT_FILTER", events: data});
            setLoading(false);

            const timestamp = dates.curr.getTime();
            const time = data.find(e => e.startsAt >= timestamp)?.startsAt;
            setStart( time ? new Date(time): undefined)
        });
    }, [dates.curr]);

    /**
     * Filter Update
     */
    useEffect(() => {
        setFilteredEvents(arrayToEventMap(events.filter(filterFn), {}));
        console.log("refresh");
    }, [filter, filterFn]);

    const getNext: loaderCallback = useCallback(async (count) => {
        const res = await getNextEvents(dates.next, count);
        setEvents(prevState => ([...prevState, ...res.data.content]));
        setFilteredEvents(prevState =>
            arrayToEventMap(res.data.content.filter(filterFn), prevState)
        );

        return res.data.last
    }, [dates.next, filterFn]);

    const getPrevious: loaderCallback = useCallback(async (count) => {
        const res = await getPreviousEvents(dates.prev, count);
        setEvents(prevState => [...res.data.content, ...prevState]);
        setFilteredEvents(prevState =>
            arrayToEventMap(res.data.content.filter(filterFn), prevState)
        );

        return res.data.last
    }, [dates.prev, filterFn]);

    return (
        <div id="events-page" className="flex px-4 flex-row h-full">
            { Object.keys(filteredEvents).length || loading ?
                <EventsScroller
                    callback={[getPrevious, getNext]}
                    events={filteredEvents}
                    loading={loading}
                    start={start}
                />
                :<p>{t("empty")}</p>
            }

            <div className="mt-5 md:w-1/4 w-1 md:block hidden fixed right-0">
                <Calendar
                    className="side-calendar shadow-md rounded"
                    next2Label={null}
                    prev2Label={null}
                    value={dates.curr}
                    onChange={(date) => {
                        setDates(prevState => ({...prevState, curr: Array.isArray(date) ? date[0]: date}))
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