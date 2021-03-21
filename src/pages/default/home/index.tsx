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
        <div className="mt-5 px-3 flex justify-center flex-wrap">
            <div className="w-full md:w-64 lg:w-1/4">
                <div className="flex p-1 mb-5 font-dinot items-center">
                    <StudentAvatar
                        id={user.id}
                        name={user.firstName + " " + user.lastName}
                        picture={user.picture}
                        pictureSize={AvatarSizes.THUMBNAIL}
                        size="large"
                    />
                    <div >
                        <h3 className="font-dinotcb mx-2 mb-0 text-2xl text-gray-700">{user.firstName + " " + user.lastName}</h3>
                        <h6 className="mx-2 -mt-1 uppercase text-sm font-bold text-gray-600">{`Promo ${user.promo}`}</h6>
                    </div>
                </div>
                <IncomingEvents className="md:hidden block"/>
                <UserGroups/>
            </div>
            <Feed id={1} className="flex-grow"/>
            <div className="w-full md:w-64 lg:w-1/4 pl-4 justify-center md:block hidden">
                <IncomingEvents allowCreate={false} />
            </div>
        </div>
    )
}

export default Home