import {isToday, toDate} from "date-fns";
import React from "react";

const EventsSCroller = () => {
    return (
        <div className="md:w-3/4 w-full">
            {Object.entries(eventsList).map(([timestamp, events]) => {
                        const date: Date = toDate(Number(timestamp));
                        return (
                            <div key={timestamp} className="my-5 flex">
                        <div className="text-center font-dinotcb w-1/6">
                        <div className="">
                        <div className="lowercase leading-none text-gray-600 text-4xl">
                        {t(`day_names.${date.getDay()}`)}
                        </div>
                        <div
                        className={`text-6xl leading-none ${isToday(date) ? "text-yellow-500" : "text-gray-400"}`}>
                        {date.getDate()}
                        </div>
                        <div
                        className={`text-3xl leading-none ${isToday(date) ? "text-yellow-500" : "text-gray-400"}`}>
                        {t(`month_names.${date.getMonth()}`)}
                        </div>
                        </div>
                        {isToday(date) &&
                        <div className="my-2 text-gray-500 leading-none border-t border-gray-300">
                            Today
                            </div>
                        }
                        </div>
                        <div className="flex flex-row flex-wrap w-5/6">
                        {events.map((e: Event, index: number) => (
                                <div key={index} className="bg-red-200 m-2" style={{height: 100, width: 250}}>

                        </div>
                    ))}
                        </div>
                        </div>
                    )
                    }
                )}
            </div>
    )
}