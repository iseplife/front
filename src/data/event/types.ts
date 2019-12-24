export type EventPreview = {
    id: number
    name: string
    startsAt: number,
    endsAt: number,
    location: string,
    imageUrl?: string
}

export type EventList = {
    [date: number]: EventPreview[]
}

export type ActionType =
    "FETCH_AROUND_INIT"
    | "FETCH_AROUND_COMPLETE"
    | "FETCH_UP_INIT"
    | "FETCH_UP_COMPLETE"
    | "FETCH_DOWN_INIT"
    | "FETCH_DOWN_COMPLETE";

export type ReducerAction = {
    type: ActionType,
    events?: EventList,
    date?: Date
}

export type Loader = {
    count: number,
    over: boolean,
    loading: boolean
}

export type EventScrollerState = {
    loading: boolean,
    events: EventList,
    up: Loader,
    down: Loader
}

