import React, {useCallback, useEffect, useMemo, useState} from "react"
import {Calendar, dateFnsLocalizer, View} from "react-big-calendar"
import {Modal, Radio} from "antd"
import {IconFA} from "../../../components/Common/IconFA"
import {EventFilter, EventPreview, FilterList} from "../../../data/event/types"
import SideCalendar from "../../../components/Calendar/SideCalendar"
import {useTranslation} from "react-i18next"
import {add, parse, format, Locale} from "date-fns"
import "react-big-calendar/lib/css/react-big-calendar.css"
import {atom, selector, useRecoilValue, useSetRecoilState} from "recoil/dist"
import {getMonthEvents} from "../../../data/event"
import ModalEventContent from "../../../components/Event/ModalEvent"
import {EventTypeColor, EventTypes} from "../../../constants/EventType"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import {enUS, fr} from "date-fns/locale"
import {CalendarEvent, CalendarEventWrapper} from "../../../components/CalendarItem"


const initFilter = (): EventFilter => {
    return (
        {
            feeds: {
                // -1 represent public events, those events have an empty targets property
                [-1]: true
            },
            types: EventTypes.reduce((acc: FilterList, type) => {
                if (!acc[type])
                    acc[type] = true
                return acc
            }, {}),
            publishedOnly: false,
            adminVision: false
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
    default: initFilter()
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

        return events.filter(e =>
            (e.published || !filter.publishedOnly) &&
            filter.adminVision || (
                filter.types[e.type] &&
                ((e.targets.length == 0 && filter.feeds[-1]) || (e.targets.some(t => filter.feeds[t])))
            ))
    }
})

const Events: React.FC = () => {
    const [selectedEvent, setSelectedEvent] = useState<EventPreview | null>(null)
    const setEvents = useSetRecoilState(eventsState)
    const filteredEvents = useRecoilValue(filteredEventsState)
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<Date>(new Date())
    const [view, setView] = useState<View>("month")
    const {t, i18n} = useTranslation("event")

    const currentMonth = date.getMonth()
    const fetchMonthEvents = useCallback(() => {
        setLoading(true)
        getMonthEvents(date.getTime()).then(r => {
            setEvents(r.data)
        }).finally(() => setLoading(false))
    }, [currentMonth])

    useEffect(() => {
        fetchMonthEvents()
    }, [fetchMonthEvents])


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
                    <div>
                        <IconFA name="fa-sync-alt" className="my-auto mx-3 cursor-pointer text-gray-500" onClick={fetchMonthEvents} spin={loading}/>
                        <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
                            <Radio.Button value="day">{t("day")}</Radio.Button>
                            <Radio.Button value="week">{t("week")}</Radio.Button>
                            <Radio.Button value="month">{t("month")}</Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
                <Calendar
                    components={{
                        eventWrapper: CalendarEventWrapper
                    }}
                    className="mb-12"
                    onSelectEvent={(e) => setSelectedEvent(e)}
                    date={date}
                    onNavigate={(d) => setDate(d)}
                    culture={i18n.language}
                    localizer={localizer}
                    events={filteredEvents}
                    toolbar={false}
                    onView={(v) => setView(v)}
                    view={view}
                />
                {selectedEvent &&
                <Modal
                    visible={true}
                    title={
                        <div className="font-bold text-2xl m-0 mx-auto flex items-center">
                            <span
                                className="text-white inline-block rounded shadow m-1 px-2 py-1 text-xs font-dinot font-semibold"
                                style={{backgroundColor: EventTypeColor[selectedEvent.type]}}>
                                {t(`type.${selectedEvent.type}`)}
                            </span>
                            <span className="ml-1">{selectedEvent.title}</span>
                        </div>
                    }
                    footer={null}
                    onCancel={() => setSelectedEvent(null)}
                >
                    <ModalEventContent id={selectedEvent.id}/>
                </Modal>
                }
            </div>
        </div>
    )
}

export default Events