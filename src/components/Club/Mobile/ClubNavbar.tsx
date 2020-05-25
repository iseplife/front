import React from "react";
import {Tabs} from "antd";
import {Club, ClubMember} from "../../../data/club/types";
import {Gallery} from "../../../data/gallery/types";
import Feed from "../../Feed";
import {useTranslation} from "react-i18next";
import Members from "../Members";
import Galleries from "../Galleries";

const { TabPane } = Tabs;

type ClubTabsProps = {
    club?: Club
    galleries: Gallery[]
    members: ClubMember[]
    clubLoading: boolean
    membersLoading: boolean
    galleriesLoading: boolean
}

const ClubNavbar: React.FC<ClubTabsProps> = (props) => {
    const {t} = useTranslation("club");

    return (
        <Tabs className="w-full md:hidden block" defaultActiveKey="1" onChange={() => console.log("change")}>
            <TabPane key="1" tab={"feed"} >
                {props.club && <Feed id={props.club.feed} allowPublication={false} />}
            </TabPane>
            <TabPane key="3" tab={t("galleries")} >
                <Galleries galleries={props.galleries} loading={props.galleriesLoading} />
            </TabPane>
            <TabPane key="3" tab={t("members")}>
                <Members members={props.members} loading={props.membersLoading} />
            </TabPane>
            <TabPane key="4" tab="Admin">
                Admin
            </TabPane>
    </Tabs>
    );
}
export default ClubNavbar;