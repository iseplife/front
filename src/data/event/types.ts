import {ClubPreview} from "../club/types"
import EventType from "../../constants/EventType"
import {Feed} from "../feed/types"

export type Event = {
    id: number
    type: EventType
    title: string
    description: string
    image?: string
    start: Date
    end: Date
    ticketURL?: string
    price?: number
    location: string
    targets: Feed[]
    published: Date
    closed: boolean
    subscribed: boolean
    hasRight: boolean
    club: ClubPreview
    feed: number
}

export type EventPreview = {
    id: number
    title: string
    type: EventType
    start: Date
    end: Date
    location: string
    cover?: string
    targets: number[]
    published: boolean
}

export type EventForm = {
    type: EventType
    title: string
    description: string
    image?: string
    start: Date
    end: Date
    ticketURL?: string
    price?: number
    location?: string
    coordinates?: Marker
    targets: number[]
    published: Date
    closed: boolean
    club: number
}

export type Marker = [number, number]

export type FilterList = {
    [name: string]: boolean
}
export type EventFilter = {
    feeds: Record<number, boolean>
    types: Record<string, boolean>
    publishedOnly: boolean
    adminVision: boolean
}
