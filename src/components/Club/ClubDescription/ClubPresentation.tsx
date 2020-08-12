import React from "react"
import {Avatar, Card, Collapse, Skeleton} from "antd"
import {RightOutlined} from "@ant-design/icons"
import ClubCover from "./ClubCover"
import About from "../About"
import Galleries from "../Galleries"
import {Gallery} from "../../../data/gallery/types"
import {IconFA} from "../../Common/IconFA"
import {useTranslation} from "react-i18next"
import {Club} from "../../../data/club/types"

import style from "../Club.module.css"

const {Panel} = Collapse

const getCoverElement = (club: Club | undefined, clubLoading: boolean): React.ReactNode => {
    return (
        <div className="h-32 md:h-40 lg:h-40 xl:h-40">

        </div>
    )
}

type ClubPresentationProps = {
    club?: Club,
    loading: boolean,
    galleries: Gallery[],
    galleriesLoading: boolean
}
const ClubPresentation: React.FC<ClubPresentationProps> = ({club, loading, galleries, galleriesLoading}) => {
    const {t} = useTranslation("club")
    return (

        <div key="desktop-display" className="hidden-scroller w-full md:w-64 lg:w-1/4 md:overflow-y-auto" style={{height: 400}}>
            <Collapse
                className="border-b-0 border-t"
                defaultActiveKey={["2"]}
                bordered={false}
                expandIconPosition="right"
                expandIcon={({isActive}) =>
                    <RightOutlined className="text-gray-600 font-bold text-sm" rotate={isActive ? 90 : 0}/>
                }
            >
                <Panel
                    key={1}
                    className="border-b-0 border-t-0"
                    header={<span className="text-gray-500">{t("about")}</span>}
                >
                    <About club={club} isLoading={loading}/>
                </Panel>
                <Panel
                    key={2}
                    className="border-b-0 border-t"
                    header={<span className="text-gray-500">{t("galleries")}</span>}
                >
                    <Galleries galleries={galleries} loading={galleriesLoading}/>
                </Panel>
            </Collapse>
        </div>

    )
}

export default ClubPresentation