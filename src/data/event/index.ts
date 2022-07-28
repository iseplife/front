import {EventPreview, Event, EventForm, EventTabPreview} from "./types"
import {AxiosPromise} from "axios"
import {GalleryPreview} from "../gallery/types"
import {Page} from "../request.type"
import {apiClient} from "../http"

export const getEvent = (id: number): AxiosPromise<Event> => apiClient.get(`/event/${id}`)

export const getEventsFrom = (clubId: number, page = 0): AxiosPromise<Page<EventTabPreview>> => apiClient.get(`/event/club/${clubId}/${page}`)

export const createEvent = (form: EventForm): AxiosPromise<Event> => apiClient.post("/event", form)

export const editEvent = (id: number, form: EventForm): AxiosPromise<Event> => apiClient.put(`/event/${id}`, form)

export const getMonthEvents = (timestamp: number): AxiosPromise<EventPreview[]> => apiClient.get(`/event/m/${timestamp}`)

export const getEventGalleries = (id: number, page = 0): AxiosPromise<Page<GalleryPreview>> => apiClient.get(`/event/${id}/galleries`, {params: {page}})

export const getIncomingEvents = (feed?: number): AxiosPromise<EventPreview[]> =>
    apiClient.get("/event/incoming", {
        params: {feed}
    })

export const getEventChildren = (id: number): AxiosPromise<EventPreview[]> => apiClient.get(`/event/${id}/children`)

