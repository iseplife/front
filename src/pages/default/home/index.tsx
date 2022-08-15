import React, {useContext, useState} from "react"
import Feed from "../../../components/Feed"
import UserGroups from "../../../components/Group/UserGroups"
import {AvatarSizes} from "../../../constants/MediaSizes"
import IncomingEvents from "../../../components/Event/IncomingEvents"
import {AppContext} from "../../../context/app/context"
import StudentLargeCard from "../../../components/Student/StudentLargeCard"
import { Divider } from "antd"
import { useTranslation } from "react-i18next"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { cFaCompassFull } from "../../../constants/CustomFontAwesome"

const Home: React.FC = () => {
    const {t} = useTranslation()
    const {state: {user}} = useContext(AppContext)
    const [discover, setDiscover] = useState(false)
    return (
        <div className="sm:mt-5 grid container mx-auto sm:grid-cols-3 lg:grid-cols-4">
            <div className="flex-1 mx-4">
                <StudentLargeCard student={user} className="hidden sm:flex" />
                <IncomingEvents className="lg:hidden block" />
                <div className="ant-divider ant-devider-horizontal mb-3 self-center hidden sm:grid"/>
                <UserGroups/>
            </div>
            <div className="w-full sm:col-span-2 overflow-x-hidden lg:overflow-x-visible">
                <Divider className="text-gray-700 text-lg px-4 md:px-10" orientation="left">
                    <div className="flex">
                        <button
                            onClick={() => setDiscover(false)}
                            className={"rounded-full text-base bg-black transition-colors px-3 py-[3px] cursor-pointer bg-opacity-[8%] hover:bg-opacity-[12%] text-neutral-700 " + (!discover && "bg-opacity-[15%] hover:bg-opacity-20 text-neutral-700")}
                        >
                            {t("posts")}
                        </button>
                        <button
                            onClick={() => setDiscover(true)}
                            className={"rounded-full text-base ml-2.5 bg-black transition-colors px-3 py-[3px] cursor-pointer bg-opacity-[8%] hover:bg-opacity-[12%] text-neutral-700 items-center " + (discover && "bg-opacity-[15%] hover:bg-opacity-20 text-neutral-700")}
                        >
                            <FontAwesomeIcon icon={cFaCompassFull} className="mr-2" />
                            Explorer
                        </button>
                    </div>
                </Divider>
                <Feed noDivider allowPublication={!discover} id={discover ? -1 : undefined} noPinned={discover} style={{flex: "2 1 0%"}} className="mx-4 md:mx-10"/>
            </div>
            <div className="flex-1 lg:block hidden mr-4">
                <IncomingEvents allowCreate={false} />
            </div>
        </div>
    )
}

export default Home
