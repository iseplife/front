import EventMapPlace from "../../../components/Event/EventMapPlace"
import React, {useCallback, useEffect, useMemo, useState} from "react"
import {Link, useHistory, useParams} from "react-router-dom"
import {MapContainer, Marker, TileLayer} from "react-leaflet"
import {getEvent, getEventGalleries} from "../../../data/event"

import {Event as EventType} from "../../../data/event/types"
import "./Event.css"
import {Skeleton} from "antd"
import {useTranslation} from "react-i18next"
import Feed from "../../../components/Feed"
import {_format, mediaPath} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import GalleriesPreview from "../../../components/Gallery/GalleriesPreview"
import GalleriesTab from "../../../components/Gallery/GalleriesTab"
import TabsSwitcher from "../../../components/Common/TabsSwitcher"
import EventEditorModal from "../../../components/Event/EventEditorModal"
import EventDescription from "../../../components/Event/EventDescription"
import EventParticipateButton from "../../../components/Event/EventParticipateButton"
import {EventTypeEmoji} from "../../../constants/EventType"
import SkeletonAvatar from "antd/lib/skeleton/Avatar"
import {isSameDay} from "date-fns"
import {subscribe} from "../../../data/subscription"
import {SubscribableType} from "../../../data/subscription/SubscribableType"
import {Subscription} from "../../../data/feed/types"
import GalleryModalForm from "../../../components/Gallery/Form/GalleryModalForm"
import SubscriptionHandler from "../../../components/Subscription"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faUserGroup } from "@fortawesome/free-solid-svg-icons"
import { WebPAvatarPolyfill } from "../../../components/Common/WebPPolyfill"
import LinkEntityPreloader from "../../../components/Optimization/LinkEntityPreloader"
import { entityPreloader } from "../../../components/Optimization/EntityPreloader"
import {AxiosError} from "axios"

interface ParamTypes {
    id?: string
}

const Event: React.FC = () => {
    const {id} = useParams<ParamTypes>()
    const {t} = useTranslation(["event", "gallery", "common"])
    const history = useHistory()
    const [event, setEvent] = useState<EventType | undefined>()
    const [showLoadingMap, setShowLoadingMap] = useState(false)
    const [tab, setTab] = useState<number>(0)
    
    const cache = useMemo(() => id ? entityPreloader.getEvent(parseInt(id)) : undefined, [id])
    const day = useMemo(() => event?.startsAt.getDate(), [event?.startsAt])
    const feed = useMemo(() => (<Feed
        key={`efeed${id}`}
        id={(event?.feed ?? cache?.feedId)}
        loading={!(event?.feed ?? cache?.feedId)}
    />), [event?.feed ?? cache?.feedId])
    const tabs = useMemo(() => ({
        [t("common:posts")]: feed,
        [t("gallery:galleries")]: event?.id ?
            <GalleriesTab elementId={event?.id} getGalleriesCallback={getEventGalleries} feedId={event.hasRight ? event?.feed : undefined} /> :
            <></>,
    }), [feed, event?.id, event?.hasRight, event?.feed])

    const coordinates = useMemo(() => event?.position?.coordinates.split(";").map(v => +v) as [number, number], [event?.position?.coordinates])

    const date = useMemo(() => {
        const startsAt = event?.startsAt ?? cache?.startsAt
        const endsAt = event?.endsAt ?? cache?.endsAt
        if (startsAt && endsAt) {
            let toRespond: string
            const startMs = startsAt.getTime()
            const fullDay = startsAt.getFullYear() == new Date().getFullYear() ? "d LLL" : "d LLL yyyy"
            const now = startMs < new Date().getTime()
            const finished = endsAt.getTime() < new Date().getTime()
            if (endsAt.getTime() - startMs <= 24 * 60 * 60 * 1000) {// It lasts for less than a day
                const delayDays = (startMs - new Date().getTime()) / 1000 / 60 / 60 / 24
                toRespond = t(now && !finished ? "event:date.until_same_day" : "event:date.same_day_this_week", {
                    day: isSameDay(new Date(), startsAt) ?
                        t("event:date.today") : // If same day, we show "Today"
                        _format(startsAt, `EEEE${(delayDays > 7 ? ` ${fullDay}` : "")}`), // If not, we show the day
                    start: _format(startsAt, "HH:mm"),
                    end: _format(endsAt, "HH:mm"),
                })
            } else
                toRespond = t(now && !finished ? "event:date.until_diff_day" : "event:date.diff_days", {
                    start: _format(startsAt, fullDay + " HH:mm"),
                    end: _format(endsAt, fullDay + " HH:mm"),
                })

            return (finished ? t("event:date.before") : "") + toRespond
        }
    }, [event?.startsAt, event?.endsAt, cache?.startsAt, cache?.endsAt])

    const setTabFactory = useCallback((tab: number) => () => setTab(tab), [])
    const galleriesCallback = useCallback((page?: number) => 
        getEventGalleries((event ?? cache)!.id, page)
    , [(event ?? cache)?.id])

    const participateCallback = useCallback(() => {
        if (event)
            subscribe(event.id, SubscribableType.EVENT, true).then(() =>
                setEvent(evt => ({
                    ...(evt as EventType),
                    subscribed: {extensive: true}
                }))
            )
    }, [event])

    const onSubscriptionUpdate = useCallback((sub: Subscription) => {
        setEvent(evt => ({
            ...(evt as EventType),
            subscribed: sub
        }))
    }, [])

    useEffect(() => {
        if (!id || !+id)
            history.replace("/404")
        else {
            getEvent(+id).then(res =>
                setEvent(res.data)
            ).catch((e: AxiosError) => {
                if (e.response && e.response.status == 404)
                    history.replace("/404")
            })
        }
    }, [id])

    useEffect(() => {
        setTimeout(() => setShowLoadingMap(true), 200)
    }, [])// Wait for fast connections

    return (<>
        <div className="w-full md:h-64 h-28 relative hidden sm:block z-10">
            {(event || showLoadingMap) &&
                <MapContainer className="w-full h-full" center={coordinates || [48.8453227, 2.3280245]} zoom={14}>
                    <TileLayer
                        url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
                        id="mapbox/streets-v11"
                        accessToken="pk.eyJ1Ijoid2FydGh5IiwiYSI6ImNrNmRzMmdvcDA5ejczZW52M2JqZWxpMzEifQ.LXqt7uNt4fHA9m4UiQofSA"
                    />
                    {coordinates && <Marker position={coordinates} />}
                </MapContainer>
            }
            <div className="container mx-auto px-4">
                <EventMapPlace position={event?.position} location={event?.location} loading={!event}/>
            </div>
            {event?.hasRight && (
                <div
                    className="absolute z-[1000] grid place-items-center top-2 right-2 sm:top-5 sm:right-5 ml-2 text-xl w-10 h-10 rounded-full bg-black/[25%] hover:bg-black/[35%] backdrop-blur-sm transition-colors cursor-pointer group"
                >
                    <EventEditorModal values={event} onSubmit={setEvent}/>
                </div>
            )}
        </div>
        {event?.hasRight && (
            <div
                className="absolute z-10 mt-2 grid place-items-center right-2 text-xl w-10 h-10 rounded-full bg-black/[25%] hover:bg-black/[35%] backdrop-blur-sm transition-colors cursor-pointer group sm:hidden"
            >
                <EventEditorModal values={event} onSubmit={setEvent}/>
            </div>
        )}
        <div className="container mx-auto mt-4">
            <div className="flex items-center px-4">
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 relative">
                    <div
                        className="w-full h-full text-3xl sm:text-4xl rounded-md bg-white shadow-sm overflow-hidden font-medium relative flex flex-col flex-shrink-0">
                        <div className="bg-red-500 w-full h-5 flex-shrink-0"/>
                        <div className="grid place-items-center h-full">{day}</div>
                    </div>

                    {event && (
                        <div
                            className="absolute -top-2.5 -right-2.5 text-lg sm:text-2xl rotate-12"
                            title={t(`type.${event?.type}`)}
                        >
                            {EventTypeEmoji[event?.type]}
                        </div>
                    )}
                </div>
                <div className="ml-4">
                    {cache?.name ?? (event ?? cache)?.title ?
                        <>
                            {date ? 
                                <div
                                    className="text-red-600 uppercase text-base md:text-lg font-bold leading-4 mb-1 md:mb-0 rounded-full">
                                    {date}
                                </div>
                                :
                                <Skeleton title={false} active paragraph={{rows: 1, width: 200}} className="-mt-0.5"/>
                            }
                            <div className="text-2xl md:text-3xl font-bold leading-6 flex items-center">
                                { (event ?? cache)?.title ?? cache?.name }

                                <div className="ml-4 md:flex hidden">
                                    <SubscriptionHandler
                                        type={SubscribableType.EVENT}
                                        subscribable={event?.id}
                                        subscription={event?.subscribed}
                                        onUpdate={onSubscriptionUpdate}
                                    />
                                </div>
                            </div>
                        </> :
                        <div className="-translate-y-1/2 absolute">
                            <Skeleton title={false} active paragraph={{rows: 1, width: 200}} className="mt-4"/>
                            <Skeleton title={false} active paragraph={{rows: 1, width: 120}}/>
                        </div>
                    }
                </div>
                <div className="ml-auto mr-0 hidden md:block">
                    <EventParticipateButton
                        price={event?.price}
                        ticketURL={event?.ticketURL}
                        onClick={participateCallback}
                    />
                </div>
            </div>
            <div className="w-full px-4 mt-5 flex">
                {event && (
                    <div className="md:hidden flex">
                        <SubscriptionHandler
                            type={SubscribableType.EVENT}
                            subscribable={event.id}
                            subscription={event.subscribed}
                            onUpdate={onSubscriptionUpdate}
                        />
                    </div>
                )}
                <div className="md:hidden ml-auto mr-0">
                    <EventParticipateButton
                        price={event?.price}
                        ticketURL={event?.ticketURL}
                        onClick={participateCallback}
                    />
                </div>
            </div>
            <div className="mt-4 sm:mt-3 grid mx-auto sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <div className="flex-1 mx-4 sm:mt-0">
                    <LinkEntityPreloader preview={event?.club}>
                        <Link to={`/club/${event?.club.id}`} className={`${!event && "pointer-events-none"}`}>
                            <div
                                className="
                                    flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white
                                    hover:bg-neutral-50 transition-colors my-5 mt-1 sm:mt-5
                                "
                            >
                                <div className="flex items-center font-normal">
                                    {event || cache?.club ?
                                        <>
                                            <WebPAvatarPolyfill
                                                src={mediaPath(event?.club.logoUrl ?? cache?.club?.logoUrl, AvatarSizes.THUMBNAIL)}
                                                icon={<FontAwesomeIcon icon={faUserGroup} />}
                                                size="large"
                                                className="hover:shadow-outline mr-1"
                                            />
                                            <div className="mx-2 mb-0 font-semibold text-md text-neutral-900 text-lg">
                                                {(event ?? cache)?.club?.name}
                                            </div>
                                        </> :
                                        <>
                                            <SkeletonAvatar active size="large"/>
                                            <Skeleton
                                                title={false} active paragraph={{rows: 1, width: 120}}
                                                className="mt-1.5 -mb-1.5 ml-3"
                                            />
                                        </>
                                    }
                                </div>
                            </div>
                        </Link>
                    </LinkEntityPreloader>

                    <div className="sm:hidden">
                        <EventDescription description={(event ?? cache)?.description} loading={!(event ?? cache)?.description} phone={true}/>
                    </div>
                    <EventMapPlace position={event?.position} location={event?.location} phone={true} loading={!event}/>
                    <div className="hidden sm:block lg:hidden">
                        <EventDescription description={(event ?? cache)?.description} loading={!(event ?? cache)?.description} />
                    </div>

                    <GalleriesPreview
                        className="sm:hidden lg:block"
                        loading={!(event ?? cache)?.id}
                        getGalleriesCallback={galleriesCallback}
                    />
                    {event?.hasRight && (
                        <div className="text-center">
                            <GalleryModalForm feed={event.feed} />
                        </div>
                    )}

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
                    <EventDescription description={(event ?? cache)?.description} loading={!(event ?? cache)?.description} />
                </div>
            </div>
        </div>
    </>)
}

export default Event
