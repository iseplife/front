import React, {useContext} from "react"
import Feed from "../../../components/Feed"
import UserGroups from "../../../components/Group/UserGroups"
import {AvatarSizes} from "../../../constants/MediaSizes"
import IncomingEvents from "../../../components/Event/IncomingEvents"
import {AppContext} from "../../../context/app/context"
import StudentAvatar from "../../../components/Student/StudentAvatar"

const Home: React.FC = () => {
    const {state: {user}} = useContext(AppContext)
    return (
        <div className="mt-5 flex justify-center flex-wrap container mx-auto">
            <div className="flex-1">
                <div className="flex p-2 mb-5 items-center hover:bg-black transition-colors hover:bg-opacity-5 rounded-lg cursor-pointer">
                    <StudentAvatar
                        id={user.id}
                        name={user.firstName + " " + user.lastName}
                        picture={user.picture}
                        pictureSize={AvatarSizes.THUMBNAIL}
                        size="large"
                    />
                    <div>
                        <h3 className="mx-2 mb-0 font-bold text-md text-gray-700">{user.firstName + " " + user.lastName}</h3>
                        <h6 className="mx-2 -mt-1 uppercase text-xs text-gray-600">{`Promo ${user.promo}`}</h6>
                    </div>
                </div>
                <IncomingEvents className="md:hidden block" />
                <div className="ant-divider ant-devider-horizontal mb-3 grid self-center"></div>
                <UserGroups/>
            </div>
            <Feed id={1} style={{flex: "2 1 0%"}} className="mx-4 md:mx-10"/>
            <div className="flex-1 md:block hidden">
                <IncomingEvents allowCreate={false} />
            </div>
        </div>
    )
}

export default Home
