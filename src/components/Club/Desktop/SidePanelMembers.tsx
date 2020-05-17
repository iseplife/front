import React from "react";
import {ClubMember} from "../../../data/club/types";
import Members from "../Members";
import style from "../Club.module.css";

interface SidePanelMembersProps {
    members: ClubMember[]
    isLoading: boolean
}
const SidePanelMembers: React.FC<SidePanelMembersProps> = ({members, isLoading}) => {
    return (
        <div className={"hidden xs:hidden md:block lg:block xl:block w-64 bg-white shadow-md ml-auto overflow-y-auto " + style.customScrollbar} style={{height: "calc(100vh - 3rem)"}}>
            <Members members={members} isLoading={isLoading}/>
        </div>
    )
};

export default  SidePanelMembers;