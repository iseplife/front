import {Club, ClubPreview} from "../club/types"
import EventType from "../../constants/EventType"
import {Feed} from "../feed/types";

export type Event = {
    id: number
    type: EventType
    title: string
    description: string
    image?: string
    start: number
    end: number
    ticketURL?: string
    price?: number
    location: string
    targets: Feed[]
    published: boolean
    closed: boolean
    subscribed: boolean
    club: ClubPreview
    feed: number
}


export type EventPreview = {
    id: number
    title: string
    type: EventType
    start: number
    end: number
    location: string
    imageUrl?: string
    targets: number[]
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
    type: "TOGGLE_FEED" | "TOGGLE_TYPE"
    name: string
}
type ReducerToggle = {
    type: "TOGGLE_PUBLISHED" | "TOGGLE_ADMIN"
}
type ReducerUpdate = {
    type: "ADD_FILTER"
    feeds: string[]
}
type ReducerInit = {
    type: "INIT_FILTER"
    events: EventPreview[]
}
export type FilterReducerAction = ReducerFeedType | ReducerToggle | ReducerUpdate | ReducerInit;

export type FilterList = {
    [name: string]: boolean
}
export type EventFilter = {
    feeds: FilterList
    types: FilterList
    publishedOnly: boolean
    adminVision: boolean
}
