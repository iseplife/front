import React, {Dispatch} from "react"
import {useTranslation} from "react-i18next"
import {EventFilter, FilterReducerAction} from "../../data/event/types"

type EventsFilerProps = {
    filter: EventFilter,
    filterFn: Dispatch<FilterReducerAction>
}
const EventsFilter: React.FC<EventsFilerProps> = ({filter, filterFn}) => {
    const {t} = useTranslation("event")
    return (
        <div className="mt-2 px-4">
            <div id="feeds-filter">
                {Object.entries(filter.feeds).map(([feed, visible]) => (
                    <span
                        key={feed}
                        className={`inline-block rounded shadow ${visible ? "bg-indigo-200 text-indigo-500": "bg-red-200 text-red-500"} m-1 px-2 py-1 text-xs  font-dinot font-semibold cursor-pointer`}
                        onClick={() => filterFn({type: "TOGGLE_FEED", name: feed})}
                    >
                        {feed}
                    </span>
                ))}
            </div>
            <p className="text-xs text-color text-gray-600 font-dinotcb uppercase mt-2">Types :</p>
            <div id="types-filter" className="flex flex-wrap">
                {Object.entries(filter.types).map(([type, visible]) => (
                    <div
                        key={type}
                        className=" m-1 px-2 py-1 text-xs text-indigo-500 font-dinot font-bold cursor-pointer">
                        <input className="rounded" type="checkbox"
                            onChange={() => filterFn({type: "TOGGLE_TYPE", name: type})} checked={visible}

                        />
                        {t(`type.${type}`)}
                    </div>
                ))}
            </div>
        </div>
    )
}
export default EventsFilter