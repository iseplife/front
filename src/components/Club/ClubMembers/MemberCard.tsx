import React, {useMemo} from "react"
import {ClubMember, ClubRoleIcon} from "../../../data/club/types"
import {Avatar} from "antd"
import {useHistory} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {mediaPath} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import {faUser} from "@fortawesome/free-regular-svg-icons"


type MemberCardProps = {
    id: number
    m: ClubMember
    showRole?: boolean
    onClick?: (id: number) => void
}
const MemberCard: React.FC<MemberCardProps> = React.memo(({id, m, onClick, showRole = false}) => {
    const history = useHistory()
    const handleClick = useMemo(() => (
        onClick ?
            () => onClick(id) :
            () => history.replace(`${history.location.pathname}/student/${m.student.id}`)
    ), [id, onClick])

    return (
        <div
            onClick={handleClick}
            title={m.student.firstName + " " + m.student.lastName}
            className="h-20 w-full sm:h-60 sm:w-44 p-2 sm:p-3 pb-2 m-2 cursor-pointer hover:shadow-outline hover:opacity-50 shadow-md flex sm:flex-col flex-row items-center bg-white rounded-lg overflow-hidden"
        >
            <Avatar
                src={mediaPath(m.student.picture, AvatarSizes.DEFAULT)}
                icon={<FontAwesomeIcon icon={faUser} />}
                alt={m.student.firstName + " " + m.student.lastName}
                shape="square"
                className="sm:w-full h-full w-1/3 rounded-lg"
            />
            <div className="sm:text-center text-left mt-0 ml-2 sm:mt-2 sm:ml-0 w-2/3 sm:w-full">
                <h5 className="font-bold text-xl mb-0 truncate">
                    {m.student.firstName + " " + m.student.lastName}
                </h5>
                <span className="text-md font-bold text-gray-500">
                    {m.position} {showRole && <FontAwesomeIcon className="ml-2" icon={ClubRoleIcon[m.role]}/>}
                </span>
            </div>
        </div>
    )
})
MemberCard.displayName = "MemberCard"

export default MemberCard
