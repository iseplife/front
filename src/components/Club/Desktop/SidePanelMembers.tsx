import React from "react"
import MembersList from "../MembersList"
import style from "../Club.module.css"

const SidePanelMembers: React.FC = () => {
    return (
        <div
            className={"hidden-scroller w-64 overflow-y-auto -mt-10 " + style.customScrollbar}
            style={{height: 530}}
        >
            <MembersList />
        </div>
    )
}

export default  SidePanelMembers