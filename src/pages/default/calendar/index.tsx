import React, {useCallback, useEffect, useMemo, useState} from "react"
import {Calendar, dateFnsLocalizer, View} from "react-big-calendar"
import {Radio} from "antd"
import {IconFA} from "../../../components/Common/IconFA"
import {EventFilter, EventPreview, FilterList, FilterReducerAction} from "../../../data/event/types"
import SideCalendar from "../../../components/Calendar/SideCalendar"
import {useTranslation} from "react-i18next"
import {add, parse, format, Locale} from "date-fns"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import {enUS, fr} from "date-fns/locale"

import "react-big-calendar/lib/css/react-big-calendar.css"
import {atom,  selector,  useRecoilValue, useSetRecoilState} from "recoil/dist"
import {getMonthEvents} from "../../../data/event"
import Types from "../../../constants/EventTypes"

//TODO: handle filter init so that it doesn't depends of events
const initFilter = (events: EventPreview[]): EventFilter => {
    const feeds = Array.from(new Set(events.map(e => e.target)))
    return (
        {
            feeds: {},
            types: Types.reduce((acc: FilterList, type) => {
                if (!acc[type])
                    acc[type] = true
                return acc
            }, {}),
            publishedOnly: false
        })
}


const locales: { [label: string]: Locale } = {
    "fr": fr,
    "en": enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})


export const filterState = atom<EventFilter>({
    key: "filterState",
    default: initFilter([])
})

export const eventsState = atom<EventPreview[]>({
    key: "eventState",
    default: []
})

export const filteredEventsState = selector<EventPreview[]>({
    key: "filteredEventsState",
    get: ({get}) => {
        const events = get(eventsState)
        const filter = get(filterState)

        return events.filter(e => /*filter.feeds[e.target] && */ filter.types[e.type] && (e.published || !filter.publishedOnly))
    }
})

const Events: React.FC = () => {
    const setEvents = useSetRecoilState(eventsState)
    const filteredEvents = useRecoilValue(filteredEventsState)
    const [date, setDate] = useState<Date>(new Date())
    const [view, setView] = useState<View>("month")
    const {t, i18n} = useTranslation("event")

    const currentMonth = date.getMonth()
    useEffect(() => {
        getMonthEvents(date.getTime()).then(r => {
            setEvents(r.data)
        })
    }, [currentMonth])


    const dateTitle: string = useMemo(() => {
        let formatPattern: string
        switch (view) {
            case "agenda":
            case "month":
            case "work_week":
            case "week":
                formatPattern = "MMMM yyyy"
                break
            case "day":
                formatPattern = "dd MMMM yyyy"
                break
        }

        return format(date, formatPattern, {locale: locales[i18n.language]})
    }, [date, view, i18n.language])

    const incrementDate = useCallback(() => {
        setDate(d => add(d, {
            months: view === "month" ? 1 : 0,
            weeks: view === "week" ? 1 : 0,
            days: view === "day" ? 1 : 0,
        }))
    }, [view])

    const decrementDate = useCallback(() => {
        setDate(d => add(d, {
            months: view === "month" ? -1 : 0,
            weeks: view === "week" ? -1 : 0,
            days: view === "day" ? -1 : 0,
        }))
    }, [view])

    return (
        <div className="h-full flex flex-row flex-wrap bg-gray-100">
            <SideCalendar date={date} handleDate={(d) => setDate(d)}/>
            <div className="flex flex-col md:w-4/5 w-full p-3">
                <div className="h-16 w-full flex justify-between items-center">
                    <div className="flex items-baseline">
                        <h1 className="text-2xl font-extrabold my-auto text-gray-800">
                            {dateTitle}
                        </h1>
                        <IconFA name="fa-arrow-left" className="my-auto mx-2 cursor-pointer text-gray-600" onClick={decrementDate}/>
                        <IconFA name="fa-arrow-right" className="my-auto mx-2 cursor-pointer text-gray-600" onClick={incrementDate}/>
                    </div>
                    <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
                        <Radio.Button value="day">{t("day")}</Radio.Button>
                        <Radio.Button value="week">{t("week")}</Radio.Button>
                        <Radio.Button value="month">{t("month")}</Radio.Button>
                    </Radio.Group>
                </div>
                <Calendar
                    className=""
                    onSelectEvent={(e) => console.log(e.title)}
                    date={date}
                    onNavigate={(d) => setDate(d)}
                    culture={i18n.language}
                    localizer={localizer}
                    events={filteredEvents}
                    toolbar={false}
                    onView={(v) => setView(v)}
                    view={view}
                />
            </div>
        </div>
    )
}

export default Events