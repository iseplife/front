import {Page} from "../request.type";

export type EventPreview = {
    id: number
    name: string
    startsAt: number | Date,
    endsAt: Number | Date,
    location: string,
    imageUrl?: string
}

export type EventList = {
    [date: number]: EventPreview[]
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

type ReducerLoading = {
    type: "FETCH_AROUND_INIT" | "FETCH_UP_INIT" | "FETCH_DOWN_INIT"
}

type ReducerMainAction = {
    type: "FETCH_AROUND_COMPLETE",
    events: EventPreview[],
}
type ReducerSideAction = {
    type: "FETCH_UP_COMPLETE" | "FETCH_DOWN_COMPLETE",
    events: Page<EventPreview>,
}

export type ReducerAction = ReducerMainAction | ReducerSideAction | ReducerLoading

export type Loader = {
    count: number,
    over: boolean,
    loading: boolean
}

export type EventScrollerState = {
    loading: boolean,
    eventsMap: EventMap,
    up: Loader,
    down: Loader
}

