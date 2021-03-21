import React, {memo} from "react"
import {Avatar} from "antd"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {IconFA} from "../Common/IconFA"
import {Link} from "react-router-dom"
import {StudentPreview} from "../../data/student/types"
import {AvatarSize} from "antd/lib/avatar/SizeContext"


type StudentAvatarProps = {
    student: StudentPreview
    pictureSize: AvatarSizes
    size: AvatarSize
    className?: string
    style?: CSSStyleSheet
}
const StudentAvatar: React.FC<StudentAvatarProps> = ({student, pictureSize = AvatarSizes.DEFAULT, size}) => (
    <Link
        className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5 text-center cursor-pointer no-underline text-gray-700 my-2"
        to={{pathname: `/discovery/student/${student.id}`}}
    >
        <Avatar
            src={mediaPath(student.picture, pictureSize)}
            icon={<IconFA name="fa-user" type="regular"/>}
            alt={student.firstName + " " + student.lastName}
            size={size}
            className="shadow-xl hover:shadow-outline "
        />
        <div className="font-bold sm:text-xl">
            <p className="-mb-2">{student.firstName + " " + student.lastName}</p>
            <span className="italic text-xs sm:text-sm">
                {"Promo " + student.promo}
            </span>
        </div>
    </Link>
)


export default memo(
    StudentAvatar,
    (prevProps, nextProps) => prevProps.student.id === nextProps.student.id
)