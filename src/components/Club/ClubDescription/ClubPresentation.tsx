import React from "react"
import {Collapse} from "antd"
import {RightOutlined} from "@ant-design/icons"
import About from "../About"
import Galleries from "../Galleries"
import {Gallery} from "../../../data/gallery/types"
import {useTranslation} from "react-i18next"

const {Panel} = Collapse

type ClubPresentationProps = {
    galleries: Gallery[],
    galleriesLoading: boolean
}
const ClubPresentation: React.FC<ClubPresentationProps> = ({galleries, galleriesLoading}) => {
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
                    <About/>
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