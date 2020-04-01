import React, {useState} from "react";
import {Tab, tabs} from "./ClubTab.helper";
import ClubNavbar from "./ClubNavbar";
import {Club, ClubMember} from "../../../data/club/type";
import Members from "../Common/Components/Members";
import Galleries from "../Common/Components/Galleries";
import About from "../Common/Components/About";
import Feed from "../../Feed";
import {Gallery} from "../../../data/gallery/type";

// Service
const renderSwitch = (activeTab : Tab | undefined, club: Club | undefined, clubLoading: boolean, members: ClubMember[], membersLoading: boolean, galleries: Gallery[], galleriesLoading: boolean): React.ReactNode => {
    switch(activeTab) {
        case tabs[0]:
            return <Members members={members} isLoading={membersLoading}></Members>;
        case tabs[1]:
            return !!club ? <Feed id={club.feed.id} allowPublication={false}/> : "";
        case tabs[2]:
            return <Galleries galleries={galleries} isLoading={galleriesLoading}></Galleries>
        case tabs[3]:
            return <About club={club} isLoading={clubLoading}></About>;
        default:
            return <Members members={members} isLoading={membersLoading}></Members>;
    }
};

interface ClubTabsProps {
    club: Club | undefined,
    galleries: Gallery[],
    members: ClubMember[],
    clubLoading: boolean,
    membersLoading: boolean,
    galleriesLoading: boolean,
}
const ClubTabs: React.FC<ClubTabsProps> = ({club, galleries, members, clubLoading, membersLoading, galleriesLoading}) => {
    const [activeTab, setActiveTab] = useState<Tab>();

    return (
        <div className="w-full xl:hidden lg:hidden md:hidden">
            <ClubNavbar onActiveTabChange={(tab: Tab) => setActiveTab(tab)}/>
            <div className="mb-20 xl:bg-white lg:bg-white md:bg-white xl:border lg:border md:border xl:border-b lg:border-b md:border-b p-4 h-full">
                { renderSwitch(activeTab, club, clubLoading, members, membersLoading, galleries, galleriesLoading) }
            </div>
        </div>
    )
};

export default ClubTabs;