import {Club} from "../club/types";
import {Feed} from "../feed/types";

export type Event = {
    id: number
    type: string
    title: string
    description: string
    startsAt: number
    endsAt: number
    ticketUrl?: string
    price?: number
    club: Club
    location: string
    imageUrl?: string
    target: string
    published: boolean
    closed: boolean
    feed: Feed
}


export type EventPreview = {
    id: number
    name: string
    type: string,
    startsAt: number,
    endsAt: number,
    location: string,
    imageUrl?: string,
    target: string,
    published: boolean
}

type DayEvent = {
    [day: number]: EventPreview[]
}
type MonthEvent = {
    [month: number]: DayEvent
}
export type EventMap = {
    [year: number]: MonthEvent
}


type ReducerFeedType = {
    type: "TOGGLE_FEED" | "TOGGLE_TYPE",
    name: string
}
type ReducerPublished = {
    type: "TOGGLE_PUBLISHED",
}
type ReducerUpdate = {
    type: "ADD_FILTER",
    feeds: string[]
}
type ReducerInit = {
    type: "INIT_FILTER",
    events: EventPreview[]
}
export type FilterReducerAction = ReducerFeedType | ReducerPublished | ReducerUpdate | ReducerInit;

export type FilterList = {
    [name: string]: boolean,
}
export type EventFilter = {
    feeds: FilterList,
    types: FilterList,
    publishedOnly: boolean,
}
