import React from "react"
import Feed from "../../../components/Feed"
import UserGroups from "../../../components/Group/UserGroups"
import {Avatar,} from "antd"
import {useSelector} from "react-redux"
import {AppState} from "../../../context/action"
import {UserOutlined,} from "@ant-design/icons"
import {mediaPath} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import IncomingEvents from "../../../components/Event/IncomingEvents"

const Home: React.FC = () => {
    const user = useSelector((state: AppState) => state.user)
    return (
        <div className="mt-5 px-3 flex justify-center flex-wrap">
            <div className="w-full md:w-64 lg:w-1/4">
                <div className="flex p-1 mb-5 font-dinot">
                    <Avatar
                        icon={<UserOutlined/>}
                        src={mediaPath(user.picture, AvatarSizes.THUMBNAIL)}
                        size="default"
                    />
                    <div >
                        <h3 className="mx-2 mb-0 text-lg text-gray-800">{user.firstName + " " + user.lastName}</h3>
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