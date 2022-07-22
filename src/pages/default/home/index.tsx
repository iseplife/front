import React, {useContext} from "react"
import Feed from "../../../components/Feed"
import UserGroups from "../../../components/Group/UserGroups"
import {AvatarSizes} from "../../../constants/MediaSizes"
import IncomingEvents from "../../../components/Event/IncomingEvents"
import {AppContext} from "../../../context/app/context"
import StudentAvatar from "../../../components/Student/StudentAvatar"
import { Link } from "react-router-dom"
import StudentLargeCard from "../../../components/Student/StudentLargeCard"

const Home: React.FC = () => {
    const {state: {user}} = useContext(AppContext)
    return (
        <div className="sm:mt-5 grid container mx-auto sm:grid-cols-3 lg:grid-cols-4">
            <div className="flex-1 mx-4">
                <StudentLargeCard student={user} className="hidden sm:flex" />
                <IncomingEvents className="lg:hidden block" />
                <div className="ant-divider ant-devider-horizontal mb-3 self-center hidden sm:grid"/>
                <UserGroups/>
            </div>
            <Feed style={{flex: "2 1 0%"}} className="mx-4 md:mx-10 sm:col-span-2"/>
            <div className="flex-1 lg:block hidden mr-4">
                <IncomingEvents allowCreate={false} />
            </div>
        </div>
    )
}

export default Home
