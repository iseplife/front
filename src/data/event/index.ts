import {EventPreview, Event, EventForm} from "./types"
import axios, {AxiosPromise} from "axios"
import {Page} from "../request.type"

export const getEvent = (id: number): AxiosPromise<Event> => axios.get(`/event/${id}`)

export const createEvent = (form: EventForm): AxiosPromise<Event> => axios.post("/event", form)

export const getMonthEvents = (timestamp: number): AxiosPromise<EventPreview[]> => axios.get(`/event/m/${timestamp}`)

export const getEventGalleries = (id: number): AxiosPromise<Event> => axios.get(`/event/${id}/galleries`)

export const getEventChildren= (id: number): AxiosPromise<EventPreview[]> => axios.get(`/event/${id}/children`)

export const getEventsAround = (timestamp: number): AxiosPromise<EventPreview[]> => axios.get(`/event/t/${timestamp}`)

export const getNextEvents = (timestamp: number, page = 0): AxiosPromise<Page<EventPreview>> => axios.get(`/event/t/${timestamp}/future?page=${page}`)

export const getPreviousEvents = (timestamp: number, page = 0): AxiosPromise<Page<EventPreview>> =>  axios.get(`/event/t/${timestamp}/previous?page=${page}`)

