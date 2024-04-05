import React, {useCallback, useContext, useState} from "react"
import Feed from "../../../components/Feed"
import UserGroups from "../../../components/Group/UserGroups"
import IncomingEvents from "../../../components/Event/IncomingEvents"
import {AppContext} from "../../../context/app/context"
import StudentLargeCard from "../../../components/Student/StudentLargeCard"
import {Divider} from "antd"
import { useTranslation } from "react-i18next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { cFaCompassFull } from "../../../constants/CustomFontAwesome"
import { AppActionType } from "../../../context/app/action"
import { useLiveQuery } from "dexie-react-hooks"
import { feedsManager } from "../../../datamanager/FeedsManager"
import { updateLastExplore } from "../../../data/student"
import EggSearch from "../../../components/EggSearch/EggSearch"
import TakeOverAnnouncement from "../../../components/TakeOverAnnouncement/TakeOverAnnouncement"
import EggShell from "../../../components/EggShell/EggShell"

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
            <div className="w-full sm:col-span-2 overflow-x-hidden lg:overflow-x-visible scrollbar-none">
                <div className={"flex justify-center items-center flex-col mx-4 md:mx-10"}>
                    <TakeOverAnnouncement></TakeOverAnnouncement>
                    <EggSearch></EggSearch>
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
