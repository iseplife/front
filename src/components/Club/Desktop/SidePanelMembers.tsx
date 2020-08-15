import React from "react"
import {ClubMember} from "../../../data/club/types"
import MembersList from "../MembersList"
import style from "../Club.module.css"

interface SidePanelMembersProps {
    members: ClubMember[]
    loading: boolean
}
const SidePanelMembers: React.FC<SidePanelMembersProps> = ({members, loading}) => {
    return (
        <div
            className={"hidden-scroller w-64 overflow-y-auto -mt-10 " + style.customScrollbar}
            style={{height: 530}}
        >
            <MembersList members={members} loading={loading}/>
        </div>
    )
}

export default  SidePanelMembers