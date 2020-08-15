import React from "react"
import {Tabs} from "antd"
import {Club, ClubMember} from "../../../data/club/types"
import {Gallery} from "../../../data/gallery/types"
import Feed from "../../Feed"
import {useTranslation} from "react-i18next"
import MembersList from "../MembersList"
import Galleries from "../Galleries"
import ClubAdmin from "../ClubAdmin";

const {TabPane} = Tabs

type ClubTabsProps = {
    club?: Club
    galleries: Gallery[]
    members: ClubMember[]
    clubLoading: boolean
    membersLoading: boolean
    galleriesLoading: boolean
}
const ClubNavbar: React.FC<ClubTabsProps> = (props) => {
    const {t} = useTranslation("club")

    return (
        <Tabs className="w-full md:hidden block" defaultActiveKey="1" centered>
            <TabPane key="1" tab={t("posts")}>
                {props.club && <Feed id={props.club.feed} allowPublication={false}/>}
            </TabPane>
            <TabPane key="2" tab={t("galleries")}>
                <Galleries galleries={props.galleries} loading={props.galleriesLoading}/>
            </TabPane>
            <TabPane key="3" tab={t("about")}>
                <div className="w-full text-center mt-2 mb-5 px-2">
                    {props.club?.description}
                </div>
                <MembersList members={props.members} loading={props.membersLoading}/>
            </TabPane>
            {props.club && props.club.canEdit &&
            <TabPane key="4" tab="Admin">
                <ClubAdmin club={props.club} members={props.members}/>
            </TabPane>
            }
        </Tabs>
    )
}
export default ClubNavbar