import React, {useContext} from "react"
import {Tabs} from "antd"
import {Club, ClubMember} from "../../../data/club/types"
import {Gallery} from "../../../data/gallery/types"
import Feed from "../../Feed"
import {useTranslation} from "react-i18next"
import MembersList from "../MembersList"
import Galleries from "../Galleries"
import ClubAdmin from "../ClubAdmin";
import {ClubContext} from "../../../context/club/context";

const {TabPane} = Tabs

type ClubTabsProps = {
    galleries: Gallery[]
    galleriesLoading: boolean
}
const ClubNavbar: React.FC<ClubTabsProps> = (props) => {
    const {t} = useTranslation("club")
    const {state: {club}} = useContext(ClubContext)

    return (
        <Tabs className="w-full md:hidden block" defaultActiveKey="1" centered>
            <TabPane key="1" tab={t("posts")}>
                {club.data && <Feed id={club.data.feed} allowPublication={false}/>}
            </TabPane>
            <TabPane key="2" tab={t("galleries")}>
                <Galleries galleries={props.galleries} loading={props.galleriesLoading}/>
            </TabPane>
            <TabPane key="3" tab={t("about")}>
                <div className="w-full text-center mt-2 mb-5 px-2">
                    {club.data?.description}
                </div>
                <MembersList/>
            </TabPane>
            {club.data && club.data.canEdit &&
            <TabPane key="4" tab="Admin">
                <ClubAdmin />
            </TabPane>
            }
        </Tabs>
    )
}
export default ClubNavbar