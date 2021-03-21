import {Link} from "react-router-dom"
import {Avatar} from "antd"
import React from "react"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {UserOutlined} from "@ant-design/icons"
import {IconFA} from "../Common/IconFA"

type StudentCardProps = {
    id: number
    fullname: string
    picture?: string
    promo: number
}

const StudentCard: React.FC<StudentCardProps> = React.memo(({id, fullname, picture, promo}) => (
    <Link
        className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5 text-center cursor-pointer no-underline text-gray-700 my-2"
        to={{pathname: `/discovery/student/${id}`}}
    >
        <Avatar
            src={mediaPath(picture, AvatarSizes.DEFAULT)}
            icon={<IconFA name="fa-user" type="regular"/>}
            alt={fullname}
            size={150}
            className="shadow-xl hover:shadow-outline "
        />
        <div className="font-bold sm:text-xl">
            <p className="-mb-2">{fullname}</p>
            <span className="italic text-xs sm:text-sm">
                {"Promo " + promo}
            </span>
        </div>
    </Link>
))
StudentCard.displayName = "StudentCard"

export default StudentCard