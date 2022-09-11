import React, {useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react"
import {Calendar, dateFnsLocalizer, Formats, View} from "react-big-calendar"
import {EventFilter, EventPreview, FilterList} from "../../../data/event/types"
import SideCalendar from "../../../components/Calendar/SideCalendar"
import {useTranslation} from "react-i18next"
import {add, parse, format, Locale} from "date-fns"
import "react-big-calendar/lib/css/react-big-calendar.css"
import {atom, selector, useRecoilValue, useSetRecoilState} from "recoil"
import {getMonthEvents} from "../../../data/event"
import {EventTypes} from "../../../constants/EventType"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import {enUS, fr} from "date-fns/locale"
import {EventWrapper, HeaderWrapper} from "../../../components/Calendar/CalendarItem"
import {CalendarContext, CalendarContextType} from "../../../context/calendar/context"
import {getUserFeed} from "../../../data/feed"
import {AppContext} from "../../../context/app/context"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSyncAlt} from "@fortawesome/free-solid-svg-icons"
import { useHistory } from "react-router-dom"
import useAdminRole from "../../../hooks/useAdminRole"
import { cFaArrowDown, cFaArrowNext } from "../../../constants/CustomFontAwesome"
import DropdownPanel from "../../../components/Common/DropdownPanel"
import DropdownPanelElement from "../../../components/Common/DropdownPanelElement"

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
    const isAdmin = useAdminRole()

    const canCreateEvent: boolean = useMemo(() => (
        isAdmin || Boolean(state.payload.clubsPublisher.length)
    ), [isAdmin, state.payload.clubsPublisher.length])

    const [feeds, setFeeds] = useState<CalendarContextType["feeds"]>({})
    const setEvents = useSetRecoilState(eventsState)
    const filteredEvents = useRecoilValue(filteredEventsState)
    const [loading, setLoading] = useState<boolean>(false)
    const [date, setDate] = useState<Date>(new Date())
    const [view, setView] = useState<View>("week")
    const { t, i18n } = useTranslation("event")
    const h = useHistory()
    const goToEvent = useCallback((event: EventPreview) => 
        h.push(`/event/${event.id}`)
    , [])

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


    const dateTitle: string = useMemo(() =>
        format(date, (view == "day" ? "d " : "") + (date.getFullYear() != new Date().getFullYear() ? "MMM yyyy" : "MMMM"), {locale: locales[i18n.language]})
    , [date, view, i18n.language])

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

    const formats: Formats = useMemo(() => {
        return {
            dayFormat: "E",
            dateFormat: "dd"
        }
    }, [])

    const eventWrapper = useMemo(() =>
        EventWrapper(view)
    , [view])
    const headerWrapper = useMemo(() =>
        HeaderWrapper(view)
    , [view])

    const [showInfo, setShowInfo] = useState(false)

    const toggleShowInfo = useCallback(() => setShowInfo(show => !show), [])

    useLayoutEffect(() => {
        document.querySelector(".rbc-time-content")?.scrollTo({top:window.innerHeight / 24 * 7 - 100 / 24 * 7})
    }, [view])

    return (
        <CalendarContext.Provider value={{feeds}}>
            <div className="h-[calc(100%-110px)] flex flex-row flex-wrap bg-gray-100">
                <SideCalendar date={date} handleDate={setDate}/>
                <div className="flex flex-col md:w-4/5 w-full pt-0 p-3 h-full">
                    <div className="w-full flex flex-wrap justify-between items-center m-2">
                        <div className="flex items-center flex-grow justify-start text-gray-700 m-2">
                            <div className="hidden sm:flex -ml-4">
                                <button onClick={decrementDate} className="p-2 active:bg-neutral-200 rounded-full w-8 h-8 flex items-center justify-center text-sm text-neutral-600">
                                    <FontAwesomeIcon icon={cFaArrowNext} className="rotate-180" />
                                </button>
                                <button onClick={incrementDate} className="p-2 active:bg-neutral-200 rounded-full w-8 h-8 flex items-center justify-center text-sm text-neutral-600 ml-1 mr-1">
                                    <FontAwesomeIcon icon={cFaArrowNext} />
                                </button>
                            </div>
                            <h1 className="text-xl font-semibold my-auto text-current capitalize">
                                {dateTitle}
                            </h1>
                            <button onClick={toggleShowInfo} className="p-2 active:bg-neutral-200 rounded-full w-8 h-8 flex items-center justify-center text-sm text-neutral-600 ml-1">
                                <FontAwesomeIcon icon={cFaArrowDown} className={`${showInfo && "rotate-180"} transition-transform`} />
                            </button>
                        </div>
                        <div className="flex">
                            <FontAwesomeIcon
                                icon={faSyncAlt}
                                spin={loading}
                                className="my-auto mx-3 cursor-pointer text-gray-500"
                                onClick={fetchMonthEvents}
                            />
                            <DropdownPanel
                                panelClassName="right-4"
                                icon={
                                    <div className="px-3 py-1 border border-neutral-300 rounded-md text-base font-medium mr-4 text-neutral-700 hover:bg-neutral-200/70 active:bg-neutral-200 transition-colors">
                                        {t(view)}
                                        <FontAwesomeIcon icon={cFaArrowDown} className="text-xs ml-1.5 mb-0.5 text-neutral-600" />
                                    </div>
                                }
                                closeOnClick
                            >
                                <DropdownPanelElement title={t("day")} onClick={() => setView("day")} />
                                <DropdownPanelElement title={t("week")} onClick={() => setView("week")} />
                                <DropdownPanelElement title={t("month")} onClick={() => setView("month")} />
                            </DropdownPanel>
                        </div>
                    </div>
                    <Calendar
                        components={{
                            eventWrapper: eventWrapper as any,
                            header: headerWrapper,
                        }}
                        className="rounded-lg w-full border-none"
                        onSelectEvent={goToEvent}
                        date={date}
                        onNavigate={setDate}
                        culture={i18n.language}
                        localizer={localizer}
                        events={filteredEvents}
                        toolbar={false}
                        onView={setView}
                        view={view}
                        formats={formats}
                    />
                </div>
            </div>
        </CalendarContext.Provider>
    )
}

export default Events
