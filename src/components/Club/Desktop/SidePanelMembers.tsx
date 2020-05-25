import React from "react";
import {ClubMember} from "../../../data/club/types";
import Members from "../Members";
import style from "../Club.module.css";

interface SidePanelMembersProps {
    members: ClubMember[]
    loading: boolean
}
const SidePanelMembers: React.FC<SidePanelMembersProps> = ({members, loading}) => {
    return (
        <div
            className={"hidden md:block w-64 bg-white shadow-md ml-auto overflow-y-auto " + style.customScrollbar}
            style={{height: "calc(100vh - 3rem)"}}
        >
            <Members members={members} loading={loading}/>
        </div>
    )
};

export default  SidePanelMembers;