import React, {ReactElement, useMemo, useState} from "react"
import {Avatar} from "antd"
import {Link} from "react-router-dom"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {UserOutlined,} from "@ant-design/icons"
import {GroupMember} from "../../data/group/types"
import {useTranslation} from "react-i18next"

const MEMBER_PREVIEW_COUNT = 10

type MemberListProps = {
    className?: string
    members: GroupMember[]
    actions: (id: number) => ReactElement
}
const MemberList: React.FC<MemberListProps> = ({members, className, actions}) => {
    const {t} = useTranslation("group")
    const [viewAll, setViewAll] = useState<boolean>(false)
    const [preview, leftovers] = useMemo(() => [members.slice(0, MEMBER_PREVIEW_COUNT), members.slice(MEMBER_PREVIEW_COUNT)], [members])

    return (
        <div>
            <div className={`${className} flex flex-col overflow-y-auto`} style={{maxHeight: 400}}>
                {preview.map(({id, student}) => (
                    <span key={student.id} className="my-1">
                        <Link to="" className="text-gray-600">
                            <Avatar
                                className="mr-2"
                                icon={<UserOutlined/>}
                                src={mediaPath(student.picture, AvatarSizes.THUMBNAIL)}
                                size="default"
                            />
                            {student.firstName + " " + student.lastName}
                        </Link>
                        {members.length > 1 && actions(id)}
                    </span>
                ))}

                {viewAll && leftovers.map(({id, student}) => (
                    <span key={student.id} className="my-1">
                        <Link to="" className="text-gray-600">
                            <Avatar
                                className="mr-2"
                                icon={<UserOutlined/>}
                                src={mediaPath(student.picture, AvatarSizes.THUMBNAIL)}
                                size="default"
                            />
                            {student.firstName + " " + student.lastName}
                        </Link>
                        {members.length > 1 && actions(id)}
                    </span>
                ))}
            </div>
            {members.length >= MEMBER_PREVIEW_COUNT && (
                <p className="cursor-pointer font-bold text-center text-gray-500" onClick={() => setViewAll(v => !v)}>
                    {viewAll ? t("see_less") : t("see_all")}
                </p>
            )}
        </div>
    )
}
MemberList.defaultProps = {
    className: ""
}

export default MemberList