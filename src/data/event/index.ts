import {EventPreview} from "./types";
import axios, {AxiosPromise} from "axios";
import {format} from "date-fns";
import {Page} from "../request.type";

export const getEventsAround = (date: Date): AxiosPromise<EventPreview[]> => {
    return axios.get(`/event/t/${format(date, "yyyy-MM-dd")}`);
};

export const getNextEvents = (date: Date, page: number = 0): AxiosPromise<Page<EventPreview>> => {
    return axios.get(`/event/t/${format(date, "yyyy-MM-dd")}/future?page=${page}`);
};

export const getPreviousEvents = (date: Date, page: number = 0): AxiosPromise<Page<EventPreview>> => {
    return axios.get(`/event/t/${format(date, "yyyy-MM-dd")}/previous?page=${page}`);
};
