import EventMapPlace from "../../../components/Event/EventMapPlace"
import React, {useCallback, useEffect, useMemo, useState} from "react"
import {useParams, useHistory, Link} from "react-router-dom"
import {Marker, TileLayer, Map} from "react-leaflet"
import {getEvent, getEventGalleries} from "../../../data/event"

import {Event as EventType} from "../../../data/event/types"
import "./Event.css"
import {Avatar, Skeleton} from "antd"
import {useTranslation} from "react-i18next"
import Feed from "../../../components/Feed"
import {mediaPath, _format} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import GalleriesPreview from "../../../components/Gallery/GalleriesPreview"
import GalleriesTab from "../../../components/Gallery/GalleriesTab"
import TabsSwitcher from "../../../components/Common/TabsSwitcher"
import EventEditorModal from "../../../components/Event/EventEditorModal"
import EventDescription from "../../../components/Event/EventDescription"
import EventParticipateButton from "../../../components/Event/EventParticipateButton"
import { EventTypeEmoji } from "../../../constants/EventType"
import SkeletonAvatar from "antd/lib/skeleton/Avatar"

interface ParamTypes {
    id?: string
}

const Event: React.FC = () => {
    const {id} = useParams<ParamTypes>()
    const {t, i18n} = useTranslation(["event", "gallery"])
    const history = useHistory()
    const [event, setEvent] = useState<EventType | undefined>()

    useEffect(() => {
        if (!id || !+id)
            history.push("/")
        else
            getEvent(+id).then(res =>
                setEvent(res.data)
            )
    }, [id])
    
    const feed = useMemo(() => (<Feed id={event?.feed} loading={!event?.feed} />), [event?.feed])

    const tabs = useMemo(() => ({
        "Publications": feed,
        [t("gallery:galleries")]: event?.id ? <GalleriesTab elementId={event?.id} getGalleriesCallback={getEventGalleries} /> : <></>,
    }), [event?.feed])
    const [tab, setTab] = useState<number>(0)
    const setTabFactory = useCallback((tab: number) => () => setTab(tab), [])

    const coordinates = useMemo(() => event?.position?.coordinates.split(";").map(v => +v) as [number, number], [event?.position?.coordinates])
    
    const date = useMemo(() => {
        if (event) {
            let toRespond: string
            const startMs = event.startsAt.getTime()
            const fullDay = event.startsAt.getFullYear() == new Date().getFullYear() ? "d LLL" : "d LLL yyyy"
            const now = startMs < new Date().getTime()
            const finished = event.endsAt.getTime() < new Date().getTime()
            if (event.endsAt.getTime() - startMs <= 24 * 60 * 60 * 1000) {// It lasts for less than a day
                const delayDays = (startMs - new Date().getTime()) / 1000 / 60 / 60 / 24
                toRespond = t(now && !finished ? "event:date.until_same_day" : "event:date.same_day_this_week", {
                    day: delayDays <= 1 && event.startsAt.getDate() == new Date().getDate() ? t("event:date.today") : _format(event.startsAt, "EEEE" + (delayDays > 7 ? ` ${fullDay}` : "")),
                    start: _format(event.startsAt, "HH:mm"),
                    end: _format(event.endsAt, "HH:mm"),
                })
            }else 
                toRespond = t(now ? "event:date.until_diff_day" : "event:date.diff_days", {
                    start: _format(event.startsAt, fullDay + " HH:mm"),
                    end: _format(event.endsAt, fullDay + " HH:mm"),
                })

            return (finished ? t("event:date.before")  : "") + toRespond
        }
    }, [event?.startsAt, event?.endsAt])

    const day = useMemo(() => event?.startsAt.getDate(), [event?.startsAt])

    const [showLoadingMap, setShowLoadingMap] = useState(false)

    useEffect(() => { setTimeout(() => setShowLoadingMap(true), 200) }, [])// Wait for fast connections

    return (<>
        <div className="w-full md:h-64 h-28 relative hidden sm:block z-10">
            {(event || showLoadingMap) &&
                <Map className="w-full h-full" center={coordinates || [48.8453227,2.3280245]} zoom={14}>
                    <TileLayer
                        url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                        id="mapbox/streets-v11"
                        accessToken="pk.eyJ1Ijoid2FydGh5IiwiYSI6ImNrNmRzMmdvcDA5ejczZW52M2JqZWxpMzEifQ.LXqt7uNt4fHA9m4UiQofSA"
                    />
                    {coordinates && (
                        <Marker position={coordinates}/>
                    )}
                </Map>
            }
            <div className="container mx-auto px-4">
                <EventMapPlace event={event} loading={!event} />
            </div>
        </div>
        <div className="container mx-auto mt-4">
            <div className="flex items-center px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 relative">
                    <div className="w-full h-full text-3xl sm:text-4xl rounded-md bg-white shadow-sm overflow-hidden font-medium relative flex flex-col flex-shrink-0">
                        <div className="bg-red-500 w-full h-5 flex-shrink-0"></div>
                        <div className="grid place-items-center h-full">{day}</div>
                    </div>

                    {event && <div className="absolute -top-2.5 -right-2.5 text-lg sm:text-2xl rotate-12" title={t(`type.${event?.type}`)}>{EventTypeEmoji[event?.type]}</div>}
                </div>
                <div className="ml-4">
                    {event ? 
                        <>
                            <div className="text-red-600 uppercase text-base md:text-lg font-bold leading-4 mb-1 md:mb-0">
                                { date }
                            </div>
                            <div className="text-2xl md:text-3xl font-bold leading-6">
                                { event.title }
                            </div>
                        </>
                        : 
                        <>
                            <Skeleton title={false} active paragraph={{ rows: 1, width: 200 }} className="mt-4" />
                            <Skeleton title={false} active paragraph={{ rows: 1, width: 120 }} />
                        </>
                    }
                </div>
                <div className="ml-auto mr-0 hidden md:block">
                    <EventParticipateButton price={event?.price} ticketURL={event?.ticketURL} />
                </div>
            </div>
            <div className="w-full px-4 mt-5 flex">
                <div className="md:hidden ml-auto mr-0">
                    <EventParticipateButton price={event?.price} ticketURL={event?.ticketURL} />
                </div>
            </div>
            <div className="mt-4 sm:mt-3 grid mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div className="flex-1 mx-4 sm:mt-0">
                    <Link to={`/club/${event?.club.id}`}>
                        <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white hover:bg-neutral-50 transition-colors my-5 mt-1 sm:mt-5">
                            <div className="flex items-center font-normal">
                                {event ? 
                                    <>
                                        <Avatar
                                            src={mediaPath(event?.club.logoUrl, AvatarSizes.THUMBNAIL)}
                                            size="large"
                                            className="hover:shadow-outline mr-1"
                                        />
                                        <div className="mx-2 mb-0 font-semibold text-md text-neutral-900 text-lg">{ event?.club.name }</div>
                                    </>
                                    :
                                    <>
                                        <SkeletonAvatar active size="large" />
                                        <Skeleton title={false} active paragraph={{ rows: 1, width: 120 }} className="mt-1.5 -mb-1.5 ml-3" />
                                    </>
                                }
                            </div>
                        </div>
                    </Link>
                    
                    <div className="sm:hidden"><EventDescription description={event?.description} loading={!event} phone={true} /></div>
                    <EventMapPlace event={event} phone={true} loading={!event} />
                    <div className="hidden sm:block lg:hidden"><EventDescription description={event?.description} loading={!event} /></div>
                    
                    <GalleriesPreview className="sm:hidden lg:block" elementId={event?.id} getGalleriesCallback={getEventGalleries} />
                </div>
                <TabsSwitcher
                    className="mt-5 mx-4 md:mx-10 md:col-span-2 lg:hidden"
                    currentTab={tab}
                    setCurrentTab={setTabFactory}
                    tabs={tabs}
                />
                <div className="hidden lg:block mx-4 md:mx-10 md:col-span-2">
                    {feed}
                </div>
                <div className="flex-1 mx-4 sm:mt-0 hidden lg:block">
                    <EventDescription description={event?.description} loading={!event} />
                </div>
            </div>
        </div>
        
        {event?.hasRight && (
            <div
                className="absolute grid place-items-center top-2 right-2 sm:top-5 sm:right-5 z-10 ml-2 text-xl w-10 h-10 rounded-full bg-black/[25%] hover:bg-black/[35%] backdrop-blur-sm transition-colors cursor-pointer group"
            >
                <EventEditorModal values={event} onSubmit={setEvent}/>
            </div>
        )}
    </>)
}

export default Event
