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
import { entityPreloader } from "../../../components/Optimization/EntityPreloader"
import { ClubPreview } from "../../../data/club/types"
import { Author } from "../../../data/request.type"
import DropdownPanel from "../../../components/Common/DropdownPanel"
import DropdownPanelElement from "../../../components/Common/DropdownPanelElement"
import { faBan } from "@fortawesome/free-solid-svg-icons"
import { feedsManager } from "../../../datamanager/FeedsManager"
import { useLiveQuery } from "dexie-react-hooks"

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
    const [{club}, dispatch] = useReducer(clubContextReducer, DEFAULT_STATE)

    const cache = useMemo(() => entityPreloader.get<Author, ClubPreview>(id), [])

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
            key={`cfeed${id}`}
            loading={!(club?.feed ?? cache?.feedId)}
            id={club?.feed ?? cache?.feedId}
            allowPublication={false}
        />,
        [t("events")]: <EventsTab elementId={id} getEventsCallback={getEventsFrom} />,
        [t("members")]: <ClubMembers />,
        ...(club?.canEdit && { "Administration": <ClubAdmin /> })
    }), [id, club?.feed, club?.canEdit, cache])

    const clubContext = useMemo(() => ({state: {club, cache}, dispatch}), [club, cache])

    const onBlock = useCallback(() => {
        const id = (club ?? cache)?.id
        if(id)
            feedsManager.addBlocked(id)
    }, [(club ?? cache)?.id])
    const onUnBlock = useCallback(() => {
        const id = (club ?? cache)?.id
        if(id)
            feedsManager.removeBlocked(id)
    }, [(club ?? cache)?.id])
    

    const isBlocked = useLiveQuery(async () => (club || cache) && (await feedsManager.getBlocked()).includes((club || cache)!.id), [(club ?? cache)?.id])

    return (
        <ClubContext.Provider value={clubContext}>
            <div className="absolute flex">
                <DropdownPanel
                    buttonClassName="absolute top-2 left-2 z-50 "
                    panelClassName="w-32 left-0 select-none text-base font-medium"
                >
                    <DropdownPanelElement icon={faBan} title={t(isBlocked ? "common:unblock" : "common:block")} onClick={isBlocked ? onUnBlock : onBlock} color="red" />
                </DropdownPanel>
            </div>
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
