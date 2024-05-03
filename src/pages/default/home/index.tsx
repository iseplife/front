import React, {useCallback, useContext, useState} from "react"
import Feed from "../../../components/Feed"
import UserGroups from "../../../components/Group/UserGroups"
import IncomingEvents from "../../../components/Event/IncomingEvents"
import {AppContext} from "../../../context/app/context"
import StudentLargeCard from "../../../components/Student/StudentLargeCard"
import { Divider } from "antd"
import { useTranslation } from "react-i18next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { cFaCompassFull } from "../../../constants/CustomFontAwesome"
import { AppActionType } from "../../../context/app/action"
import { useLiveQuery } from "dexie-react-hooks"
import { feedsManager } from "../../../datamanager/FeedsManager"
import { updateLastExplore } from "../../../data/student"
import { faArrowRight, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"

const Home: React.FC = () => {
    const {t} = useTranslation()
    const {dispatch, state: {user}} = useContext(AppContext)
    const [discover, setDiscover] = useState(false)

    const switchToDiscover = useCallback(async () => {
        setDiscover(true)
        const lastWatch = new Date((await updateLastExplore()).data)
        dispatch({
            type: AppActionType.SET_LAST_EXPLORE,
            lastWatch,
        })
    }, [])

    const exploreSince = useLiveQuery(() => feedsManager.hasExploreSince(user.lastExploreWatch), [user.lastExploreWatch])

    return (
        <div className="sm:mt-5 grid container mx-auto sm:grid-cols-3 lg:grid-cols-4">
            <div className="flex-1 mx-4">
                <StudentLargeCard student={user} className="hidden sm:flex" />
                <IncomingEvents className="lg:hidden block" />
                <div className="ant-divider ant-devider-horizontal mb-3 self-center hidden sm:grid"/>
                <UserGroups/>
            </div>
            <div className="w-full sm:col-span-2 overflow-x-hidden lg:overflow-x-visible scrollbar-none max-sm:mt-3">
                <div className="flex flex-col p-4 rounded-lg bg-white relative shadow-md mx-4 md:mx-10">
                    <div className="w-full flex justify-between mb-1">
                        <div className="text-xl font-semibold text-center w-full">
                            La semaine de campagne
                            <div className="text-base font-normal text-neutral-500">
                                C'est maintenant !
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3 relative w-9/12 mx-auto">
                        <div className="w-full rounded-md bg-green-200 grid place-items-center p-3 cursor-pointer hover:bg-green-300 transition-colors group">
                            <img className="rounded-full w-20 h-20 group-hover:scale-105 transition-transform" src="https://storage.iseplife.fr/img/clb/200x200/8ppv9T91cKdGno5Ay867kDj539FWFe.webp" />
                        </div>
                        <img src="assets/vs.webp" alt="VS" className="w-16 h-16 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-12 pointer-events-none select-none" />
                        <div className="w-full rounded-md bg-blue-200 grid place-items-center p-3 cursor-pointer hover:bg-blue-300 transition-colors group">
                            <img className="rounded-full w-20 h-20 group-hover:scale-105 transition-transform" src="https://storage.iseplife.fr/img/clb/200x200/8ppv9T91cKdGno5Ay867kDj539FWFe.webp" />
                        </div>
                    </div>

                    <div className="flex border-neutral-300 rounded-md border mt-3 px-2 py-1 text-justify">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-indigo-400 p-1" />
                        <div className="ml-1">
                            Deux listes ont travaillé d'arrache pieds pour vous préparer une semaine mémorable.
                            <br />
                            <br />
                            Deux soirées gratuites, deux befores, des crêpes, des repas et des boissons toute la journée.

                            <div className="grid place-items-center">
                                
                                <Link to="c/campaign">
                                    <button className="font-medium text-base bg-indigo-400 rouneded px-2 py-1 rounded-md text-white my-1 group hover:shadow-md transition-shadow">
                                        Découvre ça <FontAwesomeIcon icon={faArrowRight} className="ml-1 group-hover:ml-1.5 mr-0.5 group-hover:mr-0 transition-all" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider className="text-gray-700 text-lg px-4 md:px-10" orientation="left">
                    <div className="flex">
                        <button
                            onClick={() => setDiscover(false)}
                            className={"rounded-full text-base bg-black transition-colors px-3 py-[3px] cursor-pointer bg-opacity-[8%] hover:bg-opacity-[12%] text-neutral-700 " + (!discover && "bg-opacity-[15%] hover:bg-opacity-20 text-neutral-700")}
                        >
                            {t("posts")}
                        </button>
                        <button
                            onClick={switchToDiscover}
                            className={"flex relative rounded-full text-base ml-2.5 bg-black transition-colors px-3 py-[3px] cursor-pointer bg-opacity-[8%] hover:bg-opacity-[12%] text-neutral-700 items-center " + (discover && "bg-opacity-[15%] hover:bg-opacity-20 text-neutral-700")}
                        >
                            <FontAwesomeIcon icon={cFaCompassFull} className="mr-1.5" />
                            {t("explore")}
                            <div className={`absolute text-xs bg-red-400 rounded-full w-[1.125rem] h-[1.125rem] text-white grid place-items-center -top-1 -right-1.5 shadow-sm transition-transform ${exploreSince ? "scale-100" : "scale-0"}`} />
                        </button>
                    </div>
                </Divider>
                <Feed key={`feed${discover ? -1 : undefined}`} noDivider allowPublication={!discover} id={discover ? -1 : undefined} noPinned={discover} style={{flex: "2 1 0%"}} className="mx-4 md:mx-10"/>
            </div>
            <div className="flex-1 lg:block hidden mr-4">
                <IncomingEvents allowCreate={false} />
            </div>
        </div>
    )
}

export default Home
