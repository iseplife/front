import React from "react"
import {StudentPreview} from "../../data/student/types"
import {Avatar} from "antd"
import {Link} from "react-router-dom"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {UserOutlined,} from "@ant-design/icons"
import {GroupMember} from "../../data/group/types"

type MemberListProps = {
    className?: string
    members: GroupMember[]
}
const MemberList: React.FC<MemberListProps> = ({members, className}) => {
    return (
        <div className={`${className} flex flex-col`}>
            {members.map(({student}) => (
                <Link to="" key={student.id} className="text-gray-600">
                    <Avatar
                        className="mr-2"
                        icon={<UserOutlined/>}
                        src={mediaPath(student.picture, AvatarSizes.THUMBNAIL)}
                        size="default"
                    />
                    {student.firstName + " " + student.lastName}
                </Link>
            ))}
        </div>
    )
}
MemberList.defaultProps = {
    className: ""
}

export default MemberList