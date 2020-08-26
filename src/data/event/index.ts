import {EventPreview, Event, EventForm} from "./types"
import axios, {AxiosPromise} from "axios"
import {GalleryPreview} from "../gallery/types"
import {Page} from "../request.type"

export const getEvent = (id: number): AxiosPromise<Event> => axios.get(`/event/${id}`)

export const createEvent = (form: EventForm): AxiosPromise<Event> => axios.post("/event", form)

export const getMonthEvents = (timestamp: number): AxiosPromise<EventPreview[]> => axios.get(`/event/m/${timestamp}`)

export const getEventGalleries = (id: number, page = 0): AxiosPromise<Page<GalleryPreview>> => axios.get(`/event/${id}/galleries`, {params: {page}})

export const getIncomingEvents = (feed?: number): AxiosPromise<EventPreview[]> =>
    axios.get("event/incoming", {
        params: {feed}
    })

export const getEventChildren = (id: number): AxiosPromise<EventPreview[]> => axios.get(`/event/${id}/children`)

