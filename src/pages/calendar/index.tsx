import React, {useReducer, useState} from 'react';
import EventsScroller from "../../components/Event/EventsScroller";
import Calendar from 'react-calendar'
import {useTranslation} from "react-i18next";
import {EventFilter, FilterList, FilterReducerAction} from "../../data/event/types";
import {getUser} from "../../data/security";
import EventsFilter from "../../components/Event/EventsFilter";
import Types from "../../constants/EventTypes"

const initFilter = (): EventFilter => {
    const feeds = getUser()?.feed || [];
    const reg = new RegExp("^EVENT_");
    return (
        {
            feeds: feeds.filter((name: string) => !reg.test(name)).reduce((acc: FilterList, feed: string) => {
                acc[feed] = false;
                return acc
            }, {}),
            types: Types.reduce((acc: FilterList, type: string) => {
                acc[type] = false;
                return acc
            }, {}),
            "publishedOnly": true
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
    }
    return newFilter;
};

const Events: React.FC = () => {
    const {t, i18n} = useTranslation('common');
    const [date, setDate] = useState<Date | Date[]>(new Date());
    const [filter, setFilter] = useReducer(reducer, initFilter());
    return (
        <div id="events-page" className="flex px-4 flex-row h-full">
            <EventsScroller className="md:w-3/4 w-full" filter={filter}
                            timestamp={Array.isArray(date) ? date[0].getTime() : date.getTime()}/>
            <div className="mt-5 md:w-1/4 w-1 md:block hidden fixed right-0">
                <Calendar className="side-calendar shadow-md rounded"
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