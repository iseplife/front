import React, {ReactElement, useContext} from "react"
import {AvatarSizes} from "../../constants/MediaSizes"
import {GroupMember} from "../../data/group/types"
import StudentAvatar from "../Student/StudentAvatar"
import { AppContext } from "../../context/app/context"

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
                            {members.length >= actionsTrigger && student.id != user.id && <div className="mr-0 ml-auto">{actions(id)}</div>}
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