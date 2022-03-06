import {ClubPreview} from "../club/types"
import EventType from "../../constants/EventType"
import {Feed} from "../feed/types"

export type Event = {
    id: number
    type: EventType
    title: string
    description: string
    image?: string
    startsAt: Date
    endsAt: Date
    ticketURL?: string
    price?: number
    location?: string;
    position?: EventPosition
    targets: Feed[]
    published: Date
    closed: boolean
    subscribed?: { extensive: boolean }
    hasRight: boolean
    club: ClubPreview
    feed: number
}

export type EventPreview = {
    id: number
    title: string
    type: EventType
    startsAt: Date
    endsAt: Date
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
    startsAt: Date
    endsAt: Date
    ticketURL?: string
    price?: number
    location?: string
    coordinates?: Marker
    targets: number[]
    published: Date
    closed: boolean
    club: number
}

export interface EventPosition {
  coordinates: string;
  
  label: string;
  housenumber: string;
  postcode: string;
  city: string;
  context: string;
  district: string;
  street: string;
}

export type Marker = [number, number]
export interface ExtendedMarker {
    lng: number
    lat: number
}

export type FilterList = {
    [name: string]: boolean
}
export type EventFilter = {
    feeds: Record<number, boolean>
    types: Record<string, boolean>
    publishedOnly: boolean
    adminVision: boolean
}
