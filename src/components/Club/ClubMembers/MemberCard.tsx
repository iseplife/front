import React, {useMemo} from "react"
import {ClubMember, ClubRoleIcon} from "../../../data/club/types"
import {Link} from "react-router-dom"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {mediaPath} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import LinkEntityPreloader from "../../Optimization/LinkEntityPreloader"

type MemberCardProps = {
    id: number
    m: ClubMember
    showRole?: boolean
    onClick?: (id: number) => void
}
const MemberCard: React.FC<MemberCardProps> = React.memo(({id, m, onClick, showRole = false}) => {
    const fullName = useMemo(() => `${m.student.firstName} ${m.student.lastName}`, [m.student.firstName, m.student.lastName])
    return (<LinkEntityPreloader noWidth preview={m.student} className="w-1/2 xl:w-1/3 p-2">
        <Link to={`/student/${m.student.id}`} className="block w-full rounded-lg shadow-sm group">
            <div
                className={"relative bg-white rounded-t-lg overflow-hidden aspect-[18/20] w-full px-3.5 items-end flex  cursor-pointer bg-[length:112%] group-hover:bg-[length:118%] transition-all "}
                style={{
                    backgroundImage: `url("${m.student.picture ? mediaPath(m.student.picture, AvatarSizes.FULL) : "img/icons/discovery/user.svg"}")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                }}
            >
                <div className="bg-white/50 rounded-xl backdrop-blur grid place-items-center px-2 py-1 leading-6 mb-3 mt-auto ml-auto text-neutral-900 font-semibold text-sm">
                    <div className="line-clamp-2 text-ellipsis text-center max-w-full">
                        {m.position}  {showRole && <FontAwesomeIcon className="ml-2" icon={ClubRoleIcon[m.role]}/>}                
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-b-lg text-base text-center text-neutral-900 px-2 font-semibold h-14 flex items-center justify-center">
                <span className="overflow-hidden text-ellipsis line-clamp-2">{fullName}</span>
            </div>
        </Link>
    </LinkEntityPreloader>)
})

MemberCard.displayName = "MemberCard"

export default MemberCard
