import React from "react";
import {ClubMember} from "../../../data/club/type";
import Members from "../Common/Components/Members";
import style from "../Club.module.css";

interface SidepanelMembersProps { members: ClubMember[], isLoading: boolean}
const SidepanelMembers: React.FC<SidepanelMembersProps> = ({members, isLoading}) => {
    return (
        <div className={"hidden xs:hidden md:block lg:block xl:block w-64 bg-white shadow-md ml-auto overflow-y-auto " + style.customScrollbar} style={{height: "calc(100vh - 3rem)"}}>
            <Members members={members} isLoading={isLoading}/>
        </div>
    )
};

export default  SidepanelMembers;