import React, {useEffect, useMemo, useReducer, useState} from "react"
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
    const [loading, setLoading] = useState<boolean>()
    const [club, dispatch] = useReducer(clubContextReducer, DEFAULT_STATE)

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
            <div className="w-full h-full ">
                {loading && (
                    <>
                        <ClubHeader/>
                        <div key="desktop-display" className="flex flex-row -mt-10 pt-10 px-5">
                            <Tabs centered className="w-full">
                                <TabPane tab={"Accueil"} key={ClubTab.HOME_TAB}>
                                    <div className="flex flex-row flex-wrap">
                                        <ClubPresentation/>
                                        <div className="flex-grow">
                                            <Feed
                                                id={club.feed}
                                                allowPublication={false}
                                                className="m-4 hidden md:block"
                                            />
                                        </div>
                                    </div>
                                </TabPane>
                                <TabPane tab={"Membres"} className="h-full" key={ClubTab.MEMBERS_TAB}>
                                    <ClubMembers />
                                </TabPane>
                                {club.canEdit && (
                                    <TabPane tab={"Administration"} key={ClubTab.ADMIN_TAB}>
                                        <ClubAdmin/>
                                    </TabPane>
                                )}
                            </Tabs>
                        </div>
                    </>
                )}
            </div>
        </ClubContext.Provider>
    )
}

export default Club
