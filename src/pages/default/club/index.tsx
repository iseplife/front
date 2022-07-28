import React, {useCallback, useEffect, useMemo, useReducer, useState} from "react"
import {useParams} from "react-router-dom"
import {getClub} from "../../../data/club"
import {message} from "antd"
import {useHistory} from "react-router-dom"
import Feed from "../../../components/Feed"
import ClubPresentation from "../../../components/Club/ClubDescription/ClubPresentation"
import ClubAdmin from "../../../components/Club/ClubAdmin"
import {clubContextReducer} from "../../../context/club/reducer"
import {ClubContext, DEFAULT_STATE} from "../../../context/club/context"
import {ClubActionType} from "../../../context/club/action"
import ClubMembers from "../../../components/Club/ClubMembers"
import ClubHeader from "../../../components/Club/ClubHeader"
import IncomingEvents from "../../../components/Event/IncomingEvents"
import TabsSwitcher from "../../../components/Common/TabsSwitcher"
import { useTranslation } from "react-i18next"
import EventsTab from "../../../components/Event/EventsTab"
import { getEventsFrom } from "../../../data/event"

export enum ClubTab {
    HOME_TAB,
    EVENTS_TAB,
    MEMBERS_TAB,
    ADMIN_TAB
}

const Club: React.FC = () => {
    const { id: idStr } = useParams<{ id?: string }>()
    const id = useMemo(() => parseInt(idStr || ""), [idStr])
    const history = useHistory()
    const [club, dispatch] = useReducer(clubContextReducer, DEFAULT_STATE)

    const [t] = useTranslation(["club", "common"])


    const [tab, setTab] = useState<ClubTab>(ClubTab.HOME_TAB)
    const setTabFactory = useCallback((tab: number) => () => setTab(tab), [])


    /**
     * Club initialisation on mounting
     */
    useEffect(() => {
        if (!isNaN(id)) {
            getClub(+id).then(res => {
                dispatch({ type: ClubActionType.GET_CLUB, payload: res.data })
            }).catch(e =>
                message.error(e)
            )
        } else {
            history.push("404")
        }
    }, [id])

    const tabs = useMemo(() => ({
        [t("common:posts")]: <Feed
            loading={!club.feed}
            id={club.feed}
            allowPublication={false}
        />,
        [t("events")]: <EventsTab elementId={club.id} getEventsCallback={getEventsFrom} />,
        [t("members")]: <ClubMembers />,
        ...(club.canEdit && { "Administration": <ClubAdmin /> })
    }), [club.feed, club.canEdit])

    return (
        <ClubContext.Provider value={{club, dispatch}}>
            <ClubHeader />
            <div className="sm:mt-5 grid container mx-auto sm:grid-cols-3 lg:grid-cols-4">
                <div className="flex-1 mx-4 -mt-4 sm:mt-0">
                    <ClubPresentation setTab={setTab} />
                </div>
                <TabsSwitcher
                    className="sm:-mt-10 mx-4 md:mx-10 sm:col-span-2"
                    currentTab={tab}
                    setCurrentTab={setTabFactory}
                    tabs={tabs}
                />
                
                <div className="flex-1 lg:block hidden mr-4">
                    <IncomingEvents wait={!club} allowCreate={false} />
                </div>
            </div>
        </ClubContext.Provider>
    )
}

export default Club
