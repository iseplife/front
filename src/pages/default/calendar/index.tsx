import React, {useCallback, useContext, useEffect, useMemo, useState} from "react"
import {Calendar, dateFnsLocalizer, View} from "react-big-calendar"
import {Modal, Radio} from "antd"
import {EventFilter, EventPreview, FilterList} from "../../../data/event/types"
import SideCalendar from "../../../components/Calendar/SideCalendar"
import {useTranslation} from "react-i18next"
import {add, parse, format, Locale} from "date-fns"
import "react-big-calendar/lib/css/react-big-calendar.css"
import {atom, selector, useRecoilValue, useSetRecoilState} from "recoil"
import {getMonthEvents} from "../../../data/event"
import {ModalEventHeader, ModalEventContent} from "../../../components/Event/ModalEvent"
import {EventTypes} from "../../../constants/EventType"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import {enUS, fr} from "date-fns/locale"
import {EventWrapper} from "../../../components/Calendar/CalendarItem"
import EventCreatorModal from "../../../components/Event/EventCreatorModal"
import {CalendarContext, CalendarContextType} from "../../../context/calendar/context"
import {getUserFeed} from "../../../data/feed"
import {AppContext} from "../../../context/app/context"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faArrowLeft, faArrowRight, faSyncAlt} from "@fortawesome/free-solid-svg-icons"

const initFilter = (): EventFilter => {
    return (
        {
            feeds: {
                // -1 represent public events, those events have an empty targets property
                //[-1]: true
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

type CalendarEvent = EventPreview & {
    start: Date
    end: Date
}
export const filterState = atom<EventFilter>({
    key: "filterState",
    default: initFilter()
})
export const eventsState = atom<CalendarEvent[]>({
    key: "eventState",
    default: []
})

export const filteredEventsState = selector<CalendarEvent[]>({
    key: "filteredEventsState",
    get: ({get}) => {
        const events = get(eventsState)
        const filter = get(filterState)

        return events.filter(e =>
            (e.published || !filter.publishedOnly) &&
            (filter.adminVision || (
                filter.types[e.type] && // vv broke here vv
                ((e.targets.length === 0) || (e.targets.some(t => filter.feeds[t])))
            )))
    }
})

const Events: React.FC = () => {
    const {state} = useContext(AppContext)
    const canCreateEvent: boolean = useMemo(() => (
        Boolean(state.payload.clubsPublisher.length)
    ), [state.payload.clubsPublisher.length])

    const [selectedEvent, setSelectedEvent] = useState<EventPreview | null>(null)
    const [feeds, setFeeds] = useState<CalendarContextType["feeds"]>({})
    const setEvents = useSetRecoilState(eventsState)
    const filteredEvents = useRecoilValue(filteredEventsState)
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<Date>(new Date())
    const [view, setView] = useState<View>("week")
    const {t, i18n} = useTranslation("event")

    const fetchMonthEvents = useCallback(() => {
        setLoading(true)
        getMonthEvents(date.getTime()).then(r => {
            setEvents(r.data.map(e => ({...e, end: e.endsAt, start: e.startsAt})))
        }).finally(() => setLoading(false))
    }, [date])

    useEffect(() => {
        fetchMonthEvents()
    }, [fetchMonthEvents])

    /**
     * First load callback
     */
    useEffect(() => {
        getUserFeed().then(res => {
            setFeeds(res.data.reduce((acc, feed) => ({
                ...acc,
                [feed.id]: feed.name
            }), {} as CalendarContextType))
        })
    }, [])


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
        <CalendarContext.Provider value={{feeds}}>
            <div className="h-full flex flex-row flex-wrap bg-gray-100">
                <SideCalendar date={date} handleDate={(d) => setDate(d)}/>
                <div className="flex flex-col md:w-4/5 w-full pt-0 p-3 ">
                    <div className="h-16 w-full flex justify-between items-center">
                        <div className="flex items-center text-gray-700">
                            <h1 className="text-2xl font-extrabold my-auto text-current">
                                {dateTitle}
                            </h1>
                            <FontAwesomeIcon icon={faArrowLeft} className="my-auto mx-2 cursor-pointer" onClick={decrementDate}/>
                            <FontAwesomeIcon icon={faArrowRight} className="my-auto mx-2 cursor-pointer" onClick={incrementDate}/>
                            {canCreateEvent && (
                                <EventCreatorModal onSubmit={fetchMonthEvents} className="fixed bottom-8 right-8 z-10 py-2"/>
                            )}
                        </div>
                        <div>
                            <FontAwesomeIcon
                                icon={faSyncAlt}
                                spin={loading}
                                className="my-auto mx-3 cursor-pointer text-gray-500"
                                onClick={fetchMonthEvents}
                            />
                            <Radio.Group value={view}  onChange={(e) => setView(e.target.value)}>
                                <Radio.Button value="day">{t("day")}</Radio.Button>
                                <Radio.Button value="week">{t("week")}</Radio.Button>
                                <Radio.Button value="month">{t("month")}</Radio.Button>
                            </Radio.Group>
                        </div>
                    </div>
                    <Calendar
                        components={{
                            eventWrapper: EventWrapper
                        }}
                        className="mb-12 bg-white shadow rounded-lg"
                        onSelectEvent={setSelectedEvent}
                        date={date}
                        onNavigate={(d) => setDate(d)}
                        culture={i18n.language}
                        localizer={localizer}
                        events={filteredEvents}
                        toolbar={false}
                        onView={(v) => setView(v)}
                        view={view}
                    />
                    {selectedEvent && (
                        <Modal
                            className="md:w-1/2 w-4/5"
                            visible={true}
                            title={<ModalEventHeader event={selectedEvent}/>}
                            footer={null}
                            onCancel={() => setSelectedEvent(null)}
                        >
                            <ModalEventContent id={selectedEvent.id}/>
                        </Modal>
                    )}
                </div>
            </div>
        </CalendarContext.Provider>
    )
}

export default Events
