import {ClubPreview} from "../club/types"
import EventType from "../../constants/EventType"
import {Feed, Subscription} from "../feed/types"
import { GalleryPreview } from "../gallery/types"

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
    location?: string
    position?: EventPosition
    targets: Feed[]
    published: Date
    closed: boolean
    subscribed: Subscription
    hasRight: boolean
    club: ClubPreview
    feed: number
    allow_publications: boolean
}

export type EventPreview = {
    id: number
    club: ClubPreview
    feedId: number
    title: string
    description: string
    type: EventType
    startsAt: Date
    endsAt: Date
    location: string
    cover?: string
    targets: number[]
    published: boolean
}
export type EventTabPreview = EventPreview & {
    galleries?: GalleryPreview[]
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
  coordinates: string
  label: string
  housenumber: string
  postcode: string
  city: string
  context: string
  district: string
  street: string
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

export interface PlaceResponse {
    features: PlaceResponseFeature[]
}
export interface PlaceResponseFeature {
    geometry: PlaceResponseFeatureGeometry
    properties: PlaceResponseFeatureProperties
}
export interface PlaceResponseFeatureGeometry {
    coordinates: [number, number]
}
export interface PlaceResponseFeatureProperties {
    city:        string
    citycode:    string
    context:     string
    housenumber: string
    id:          string
    importance:  number
    label:       string
    name:        string
    postcode:    string
    score:       number
    street:      string
    type:        string
    x:           number
    y:           number
}