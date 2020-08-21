import {EventPreview, Event, EventForm} from "./types"
import axios, {AxiosPromise} from "axios"
import {Gallery} from "../gallery/types"

export const getEvent = (id: number): AxiosPromise<Event> => axios.get(`/event/${id}`)

export const createEvent = (form: EventForm): AxiosPromise<Event> => axios.post("/event", form)

export const getMonthEvents = (timestamp: number): AxiosPromise<EventPreview[]> => axios.get(`/event/m/${timestamp}`)

export const getEventGalleries = (id: number): AxiosPromise<Gallery[]> => axios.get(`/event/${id}/galleries`)

export const getEventChildren= (id: number): AxiosPromise<EventPreview[]> => axios.get(`/event/${id}/children`)

