import React, {Dispatch} from "react"
import Calendar from "react-calendar"
import {useTranslation} from "react-i18next"
import {EventFilter, FilterReducerAction} from "../../data/event/types"
import Tag from "../Common/Tag"

type SideCalendarProps = {
    date: Date
    handleDate: (d: Date) => void
    className: string
    filter: EventFilter,
    handleFilter: Dispatch<FilterReducerAction>
};
const SideCalendar: React.FC<SideCalendarProps> = ({filter, handleFilter, date, handleDate, className}) => {
    const {t, i18n} = useTranslation("event")

    return (
        <div className={`${className} flex flex-column shadow bg-white p-4 relative`}>
            <div className="sticky w-full" style={{top: "1rem"}}>
                <Calendar
                    locale={i18n.language}
                    value={date}
                    onChange={(d) => handleDate(Array.isArray(d) ? d[0]: d)}
                />
                <div className="mt-2 px-4">
                    <div id="feeds-filter">
                        {Object.entries(filter.feeds).map(([feed, selected]) => (
                            <Tag selected={selected} onClick={() => handleFilter({type: "TOGGLE_FEED", name: feed})}>
                                {feed}
                            </Tag>
                        ))}
                    </div>
                    <p className="text-xs text-color text-gray-600 font-dinotcb uppercase mt-2">Types :</p>
                    <div id="types-filter" className="flex flex-wrap">
                        {Object.entries(filter.types).map(([type, visible]) => (
                            <div
                                key={type}
                                className=" m-1 px-2 py-1 text-xs text-indigo-500 font-dinot font-bold cursor-pointer">
                                <input className="rounded" type="checkbox"
                                    onChange={() => handleFilter({type: "TOGGLE_TYPE", name: type})} checked={visible}

                                />
                                {t(`type.${type}`)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

SideCalendar.defaultProps = {
    className: ""
}
export default SideCalendar