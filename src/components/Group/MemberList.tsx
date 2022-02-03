import React, {ReactElement, useMemo, useState} from "react"
import {AvatarSizes} from "../../constants/MediaSizes"
import {GroupMember} from "../../data/group/types"
import {useTranslation} from "react-i18next"
import StudentAvatar from "../Student/StudentAvatar"

export const MEMBER_PREVIEW_COUNT = 5

type MemberListProps = {
    className?: string
    members: GroupMember[]
    actions: (id: number) => ReactElement
    actionsTrigger?: number
}
const MemberList: React.FC<MemberListProps> = ({members, className, actions, actionsTrigger = 1}) => {
    return (
        <div>
            <div className={`${className} flex flex-col overflow-y-auto`} style={{maxHeight: 400}}>
                {members.map(({id, student}) => (
                    <span key={student.id} className="my-1 flex">
                        <StudentAvatar
                            id={student.id}
                            name={student.firstName + " " + student.lastName}
                            picture={student.picture}
                            pictureSize={AvatarSizes.THUMBNAIL}
                            size="small"
                            className="mr-2 text-gray-500 hover:text-gray-600 hover:bg-black hover:bg-opacity-5 transition-colors rounded-lg p-2 w-full"
                            showPreview
                        >
                            <div className="ml-2 flex-shrink-0">{student.firstName + " " + student.lastName}</div>
                            {members.length >= actionsTrigger && <div className="mr-0 ml-auto">{actions(id)}</div>}
                        </StudentAvatar>
                    </span>
                ))}
            </div>
        </div>
    )
}
MemberList.defaultProps = {
    className: ""
}

export default MemberList