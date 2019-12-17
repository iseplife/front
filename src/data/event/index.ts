import {EventList, EventPreview} from "./types";

export const getCurrentEvents = (): EventList => {
    return  {
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



export const getDayEvents = (date: Date): EventList => {
    const t = date.setDate(date.getDate() + 1);
    let ev :EventList= {};
    ev[t] = [
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
        }
    ]
    return  ev;
};
