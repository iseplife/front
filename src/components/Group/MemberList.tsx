import React, {ReactElement, useMemo, useState} from "react"
import {AvatarSizes} from "../../constants/MediaSizes"
import {GroupMember} from "../../data/group/types"
import {useTranslation} from "react-i18next"
import StudentAvatar from "../Student/StudentAvatar"

const MEMBER_PREVIEW_COUNT = 10

type MemberListProps = {
    className?: string
    members: GroupMember[]
    actions: (id: number) => ReactElement
    actionsTrigger?: number
}
const MemberList: React.FC<MemberListProps> = ({members, className, actions, actionsTrigger = 1}) => {
    const {t} = useTranslation("group")
    const [viewAll, setViewAll] = useState<boolean>(false)
    const [preview, leftovers] = useMemo(() => [members.slice(0, MEMBER_PREVIEW_COUNT), members.slice(MEMBER_PREVIEW_COUNT)], [members])

    return (
        <div>
            <div className={`${className} flex flex-col overflow-y-auto`} style={{maxHeight: 400}}>
                {preview.map(({id, student}) => (
                    <span key={student.id} className="my-1">
                        <StudentAvatar
                            id={student.id}
                            name={student.firstName + " " + student.lastName}
                            picture={student.picture}
                            pictureSize={AvatarSizes.THUMBNAIL}
                            size="small"
                            className="mr-2 text-gray-600 hover:bg-black hover:bg-opacity-5 transition-colors rounded-lg p-2 w-full"
                            showPreview
                        >
                            {student.firstName + " " + student.lastName}
                        </StudentAvatar>
                        {members.length > actionsTrigger && actions(id)}
                    </span>
                ))}

                {viewAll && leftovers.map(({id, student}) => (
                    <span key={student.id} className="my-1">
                        <StudentAvatar
                            id={student.id}
                            name={student.firstName + " " + student.lastName}
                            picture={student.picture}
                            pictureSize={AvatarSizes.THUMBNAIL}
                            size="default"
                            className="mr-2 text-gray-600 hover:bg-black hover:bg-opacity-5 transition-colors rounded-lg p-2 w-full"
                            showPreview
                        >
                            {student.firstName + " " + student.lastName}
                        </StudentAvatar>
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