import {EventList} from "./types";
import axios, {AxiosPromise} from "axios";
import {format} from "date-fns";

export const getEventsAround = (date: Date): AxiosPromise<EventList> => {
    return axios.get(`/event/t/${format(date, "yyyy-MM-dd")}`);
};

export const getNextEvents = (date: Date, page: number = 0): AxiosPromise<EventList> => {
    return axios.get(`/event/t/${format(date, "yyyy-MM-dd")}/future?page=${page}`);
};

export const getPreviousEvents = (date: Date, page: number = 0): AxiosPromise<EventList> => {
    return axios.get(`/event/t/${format(date, "yyyy-MM-dd")}/previous?page=${page}`);
};
