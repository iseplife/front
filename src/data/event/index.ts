import {EventPreview} from "./types";
import axios, {AxiosPromise} from "axios";
import {Page} from "../request.type";

export const getEventsAround = (timestamp: number): AxiosPromise<EventPreview[]> => {
    return axios.get(`/event/t/${timestamp}`);
};

export const getNextEvents = (timestamp: number, page: number = 0): AxiosPromise<Page<EventPreview>> => {
    return axios.get(`/event/t/${timestamp}/future?page=${page}`);
};

export const getPreviousEvents = (timestamp: number, page: number = 0): AxiosPromise<Page<EventPreview>> => {
    return axios.get(`/event/t/${timestamp}/previous?page=${page}`);
};
