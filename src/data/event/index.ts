import {EventPreview, Event} from "./types"
import axios, {AxiosPromise} from "axios"
import {Page} from "../request.type"

export const getEvent = (id: number): AxiosPromise<Event> => {
    return axios.get(`/event/${id}`)
}

export const getEventGalleries = (id: number): AxiosPromise<Event> => {
    return axios.get(`/event/${id}/galleries`)
}

export const getEventChildren= (id: number): AxiosPromise<EventPreview[]> => {
    return axios.get(`/event/${id}/children`)
}

export const getEventsAround = (timestamp: number): AxiosPromise<EventPreview[]> => {
    return axios.get(`/event/t/${timestamp}`)
}

export const getNextEvents = (timestamp: number, page = 0): AxiosPromise<Page<EventPreview>> => {
    return axios.get(`/event/t/${timestamp}/future?page=${page}`)
}

export const getPreviousEvents = (timestamp: number, page = 0): AxiosPromise<Page<EventPreview>> => {
    return axios.get(`/event/t/${timestamp}/previous?page=${page}`)
}
