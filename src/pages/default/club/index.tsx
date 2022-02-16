import React, {useCallback, useEffect, useMemo, useReducer, useState} from "react"
import {useParams} from "react-router"
import {getClub} from "../../../data/club"
import {message, Tabs} from "antd"
import {useHistory} from "react-router-dom"
import Feed from "../../../components/Feed"
import ClubPresentation from "../../../components/Club/ClubDescription/ClubPresentation"
import ClubAdmin from "../../../components/Club/ClubAdmin"
import {clubContextReducer} from "../../../context/club/reducer"
import {ClubContext, DEFAULT_STATE} from "../../../context/club/context"
import {ClubActionType} from "../../../context/club/action"
import ClubMembers from "../../../components/Club/ClubMembers"
import ClubHeader from "../../../components/Club/ClubHeader"
import ClubSkeleton from "../../../components/Club/Skeleton"
import IncomingEvents from "../../../components/Event/IncomingEvents"
import TabsSwitcher from "../../../components/Common/TabsSwitcher"
import { useTranslation } from "react-i18next"

enum ClubTab {
    HOME_TAB,
    MEMBERS_TAB,
    ADMIN_TAB
}

const {TabPane} = Tabs
const Club: React.FC = () => {
    const {id: idStr} = useParams<{ id?: string }>()
    const id = useMemo(() => parseInt(idStr || ""), [idStr])
    const history = useHistory()
    const [loading, setLoading] = useState<boolean>(true)
    const [club, dispatch] = useReducer(clubContextReducer, DEFAULT_STATE)

    const [t] = useTranslation("club")


    const [tab, setTab] = useState<ClubTab>(ClubTab.HOME_TAB)
    const setTabFactory = useCallback((tab: number) => () => setTab(tab), [])


    /**
     * Club initialisation on mounting
     */
    useEffect(() => {
        if (!isNaN(id)) {
            setLoading(true)
            getClub(+id).then(res => {
                dispatch({type: ClubActionType.GET_CLUB, payload: res.data})
            }).catch(e =>
                message.error(e)
            ).finally(() => setLoading(false))
        } else {
            history.push("404")
        }
    }, [id])


    return (
        <ClubContext.Provider value={{club, dispatch}}>
            <ClubHeader />
            <div className="sm:mt-5 flex justify-center container mx-auto md:flex-nowrap flex-wrap">
                <div className="flex-1 mx-4">
                    <ClubPresentation/>
                </div>
                <TabsSwitcher
                    currentTab={tab}
                    setCurrentTab={setTabFactory}
                    tabs={{
                        "Publications": <Feed
                            id={club.feed}
                        />,
                        [t("members")]: <ClubMembers />,
                        ...(club.canEdit ? { "Administration": <ClubAdmin/> } : {})
                    }}
                />
                
                <div className="flex-1 lg:block hidden mr-4">
                    <IncomingEvents allowCreate={false} />
                </div>
            </div>
        </ClubContext.Provider>
    )
}

export default Club
