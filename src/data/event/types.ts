export type EventPreview = {
    id: number
    name: string
    startsAt: number | Date,
    endsAt: Number | Date,
    location: string,
    imageUrl?: string
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

export type FilterReducerAction = {
    type: "TOGGLE_FEED" | "TOGGLE_TYPE" | "TOGGLE_PUBLISHED",
    name: string
}

export type FilterList = {
    [name: string]: boolean,
}

export type EventFilter = {
    feeds: FilterList,
    types: FilterList,
    publishedOnly: boolean,

}
