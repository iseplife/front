import React from "react"
import Calendar from "react-calendar"
import {useTranslation} from "react-i18next"
import Tag from "../Common/Tag"
import {useRecoilState} from "recoil/dist"
import {filterState} from "../../pages/default/calendar"
import {Checkbox} from "antd"

type SideCalendarProps = {
    date: Date
    handleDate: (d: Date) => void
    className: string
};
const SideCalendar: React.FC<SideCalendarProps> = ({ date, handleDate, className}) => {
    const {t, i18n} = useTranslation("event")
    const [filter, setFilter] = useRecoilState(filterState)

    const handleChange = (type: string, name: string) => {
        setFilter(prev => {
            switch (type) {
                case "TOGGLE_FEED":
                    return ({
                        ...prev,
                        feeds: {
                            ...prev.feeds,
                            [name]: !prev.feeds[name]
                        }
                    })
                case "TOGGLE_TYPE":
                    return ({
                        ...prev,
                        types: {
                            ...prev.types,
                            [name]: !prev.types[name]
                        }
                    })
                case "TOGGLE_PUBLISHED":
                    return ({
                        ...prev,
                        publishedOnly: !prev.publishedOnly
                    })
                default:
                    return prev
            }
        })
    }

    return (
        <div className={`${className} flex flex-column shadow bg-white p-4 relative`}>
            <div className="sticky w-full" style={{top: "1rem"}}>
                <Calendar
                    locale={i18n.language}
                    value={date}
                    onChange={(d) => handleDate(Array.isArray(d) ? d[0]: d)}
                />
                <div className="mt-2">
                    <h3 className="text-gray-600 font-dinotcb uppercase mt-2">Feed :</h3>
                    <div id="feeds-filter">
                        {Object.entries(filter.feeds).map(([feed, selected]) => (
                            <Tag key={feed} selected={selected} onClick={() => handleChange("TOGGLE_FEED", feed)}>
                                {feed}
                            </Tag>
                        ))}
                    </div>
                    <h3 className="text-gray-600 font-dinotcb uppercase mt-2">Types :</h3>
                    <div id="types-filter" className="flex flex-wrap">
                        {Object.entries(filter.types).map(([type, visible]) => (
                            <Checkbox className="w-1/2 mx-0" key={type} onChange={() => handleChange("TOGGLE_TYPE", type)} checked={visible}>
                                {t(`type.${type}`)}
                            </Checkbox>
                        ))}
                    </div>
                    <button onClick={() => handleChange("TOGGLE_PUBLISHED", "")}>click</button>
                </div>
            </div>
        </div>
    )
}

SideCalendar.defaultProps = {
    className: ""
}
export default SideCalendar