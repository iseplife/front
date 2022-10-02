import React from "react"
import Calendar from "react-calendar"
import {useTranslation} from "react-i18next"
import {useRecoilState} from "recoil"
import {filterState} from "../../pages/default/calendar"
import { Checkbox, Switch} from "antd"
import "./SideCalendar.css"
import FeedFilter from "../Feed/FeedFilter"
import {EventTypeEmoji} from "../../constants/EventType"
import useAdminRole from "../../hooks/useAdminRole"

type SideCalendarProps = {
    date: Date
    handleDate: (d: Date) => void
}
const SideCalendar: React.FC<SideCalendarProps> = ({date, handleDate}) => {
    const {t, i18n} = useTranslation("event")
    const [filter, setFilter] = useRecoilState(filterState)
    const isAdmin = useAdminRole()

    const handleChange = (type: string, name: string | number) => {
        setFilter(prev => {
            switch (type) {
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
                case "TOGGLE_ADMIN":
                    return ({
                        ...prev,
                        adminVision: !prev.adminVision
                    })
                default:
                    return prev
            }
        })
    }

    return <div id="side-cal" className="hidden md:block md:w-1/5 w-full shadow bg-white">
        <div className="sticky w-full p-4" style={{top: "1rem"}}>
            <Calendar
                className="hidden md:block"
                locale={i18n.language}
                value={date}
                onChange={(d: Date) => handleDate(Array.isArray(d) ? d[0] : d)}
            />
            <hr className="my-1"/>
            <div className="mt-2">
                {isAdmin &&
                <>
                    <div className="flex items-center">
                        <h3 className="text-gray-600 uppercase mb-0">{t("admin_view")} :</h3>
                        <Switch className="ml-4" size="small" checked={filter.adminVision} onChange={() => handleChange("TOGGLE_ADMIN", "")}/>
                    </div>
                    <div className="flex items-center">
                        <h3 className="text-gray-600 uppercase mb-0">{t("published_only")} :</h3>
                        <Switch className="ml-4" size="small" checked={filter.publishedOnly} onChange={() => handleChange("TOGGLE_PUBLISHED", "")}/>
                    </div>
                </>
                }
                <hr className="my-1"/>
                <h3 className="text-gray-600 uppercase mt-2">Feed :</h3>
                <FeedFilter />
                <h3 className="text-gray-600 uppercase mt-2">Types :</h3>
                <div id="types-filter" className="flex flex-wrap">
                    {Object.entries(filter.types).map(([type, visible]) => (
                        <Checkbox className="mx-0 text-black whitespace-no-wrap" style={{minWidth: "50%"}} key={type} onChange={() => handleChange("TOGGLE_TYPE", type)} checked={visible}>
                            {EventTypeEmoji[type]+ " "+ t(`type.${type}`)}
                        </Checkbox>
                    ))}
                </div>
            </div>
        </div>
    </div>
}

export default SideCalendar
