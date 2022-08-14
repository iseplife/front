import React, {ReactElement, useContext, useMemo, useState} from "react"
import {AvatarSizes} from "../../constants/MediaSizes"
import {GroupMember} from "../../data/group/types"
import {useTranslation} from "react-i18next"
import StudentAvatar from "../Student/StudentAvatar"
import { AppContext } from "../../context/app/context"
import { Link } from "react-router-dom"

export const MEMBER_PREVIEW_COUNT = 5

type MemberListProps = {
    className?: string
    members: GroupMember[]
    actions: (id: number) => ReactElement
    actionsTrigger?: number
}
const MemberList: React.FC<MemberListProps> = ({members, className, actions, actionsTrigger = 1}) => {
    const {state: {user}} = useContext(AppContext)
    return (
        <div>
            <div className={`${className} flex flex-col overflow-y-auto overflow-x-hidden w-full`} style={{maxHeight: 400}}>
                {members.map(({id, student}) => (
                    <Link to={`/student/${student.id}`} key={student.id} className="my-[1px] flex w-full mr-2 text-gray-500 hover:text-gray-600 hover:bg-black hover:bg-opacity-5 transition-colors rounded-lg p-2 items-center">
                        <StudentAvatar
                            id={student.id}
                            name={student.firstName + " " + student.lastName}
                            picture={student.picture}
                            pictureSize={AvatarSizes.THUMBNAIL}
                            size="small"
                            className="flex-shrink-0"
                        />
                        <div className="ml-2 overflow-hidden text-ellipsis whitespace-nowrap">{student.firstName + " " + student.lastName}</div>
                        {members.length >= actionsTrigger && student.id != user.id && <div className="mr-0 ml-auto">{actions(id)}</div>}
                    </Link>
                ))}
            </div>
        </div>
    )
}
MemberList.defaultProps = {
    className: ""
}

export default MemberList