import {EventList} from "./types";
import axios, {AxiosPromise} from "axios";
import {format} from "date-fns";

export const getCurrentEvents = (): EventList => {
    return {
        1576517027768: [
            {
                id: 1,
                name: "event1",
                startsAt: 11,
                endsAt: 23,
                location: "ndl"
            },
            {
                id: 2,
                name: "event2",
                startsAt: 11,
                endsAt: 23,
                location: "ndl"
            },
            {
                id: 2,
                name: "event2",
                startsAt: 11,
                endsAt: 23,
                location: "ndl"
            },
            {
                id: 2,
                name: "event2",
                startsAt: 11,
                endsAt: 23,
                location: "ndl"
            }
        ],
        1576000027308: [
            {
                id: 1,
                name: "event1",
                startsAt: 11,
                endsAt: 23,
                location: "ndl"
            }
        ],
        1500017027730: [
            {
                id: 1,
                name: "event1",
                startsAt: 11,
                endsAt: 23,
                location: "ndl"
            }
        ],
    };
};


export const getEventsAround = (date: Date): AxiosPromise<EventList> => {
    return axios.get(`/event/t/${format(date, "yyyy-MM-dd")}`);
};

export const getNextEvents = (date: Date, page: number = 0): AxiosPromise<EventList> => {
    return axios.get(`/event/t/${format(date, "yyyy-MM-dd")}/future?page=${page}`);
};

export const getPreviousEvents = (date: Date, page: number = 0): AxiosPromise<EventList> => {
    return axios.get(`/event/t/${format(date, "yyyy-MM-dd")}/previous?page=${page}`);
};
