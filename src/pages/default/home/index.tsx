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
        <div className="sm:mt-5 flex justify-center container mx-auto md:flex-nowrap flex-wrap">
            <div className="flex-1 ml-4">
                <div className="p-2 mb-5 items-center hover:bg-black transition-colors hover:bg-opacity-5 rounded-lg cursor-pointer hidden sm:flex">
                    <StudentAvatar
                        id={user.id}
                        name={user.firstName + " " + user.lastName}
                        picture={user.picture}
                        pictureSize={AvatarSizes.THUMBNAIL}
                        size="large"
                    />
                    <div>
                        <h3 className="mx-2 mb-0 font-bold text-md text-gray-700 leading-4 mt-1 hidden lg:block">{user.firstName + " " + user.lastName}</h3>
                        <h3 className="mx-2 mb-0 font-bold text-md text-gray-700 leading-4 mt-1 block lg:hidden">{user.firstName}</h3>
                        <h6 className="mx-2 -mt-0.5 uppercase text-xs text-gray-600">{`Promo ${user.promo}`}</h6>
                    </div>
                </div>
                <IncomingEvents className="lg:hidden block" />
                <div className="ant-divider ant-devider-horizontal mb-3 self-center hidden sm:grid"></div>
                <UserGroups/>
            </div>
            <Feed id={1} style={{flex: "2 1 0%"}} className="mx-4 md:mx-10"/>
            <div className="flex-1 lg:block hidden mr-4">
                <IncomingEvents allowCreate={false} />
            </div>
        </div>
    )
}

export default Home
