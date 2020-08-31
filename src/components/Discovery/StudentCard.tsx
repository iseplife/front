import {Link} from "react-router-dom"
import {Avatar} from "antd"
import React from "react"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {UserOutlined} from "@ant-design/icons"

type StudentCardProps = {
    id: number
    fullname: string
    picture?: string
    promo: number
}

const StudentCard: React.FC<StudentCardProps> = React.memo(({id, fullname, picture, promo}) => (
    <Link
        className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5 text-center cursor-pointer no-underline text-gray-700"
        to={{pathname: `/discovery/student/${id}`}}
    >
        <Avatar
            src={mediaPath(picture, AvatarSizes.DEFAULT)}
            icon={<UserOutlined/>}
            alt={fullname}
            size={140}
            className="shadow-xl hover:shadow-outline text-3xl sm:text-5xl md:text-5xl xl:text-6xl"
        />
        <p className="font-bold sm:text-xl">
            {fullname}
            <br/>
            <span className="italic text-xs sm:text-sm">
                {"Promo " + promo}
            </span>
        </p>
    </Link>
))
StudentCard.displayName = "StudentCard"

export default StudentCard