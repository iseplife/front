import React from "react"
import {Collapse} from "antd"
import About from "../About"
import {useTranslation} from "react-i18next"
import GalleriesPreview from "../../Gallery/GalleriesPreview"
import {faChevronRight} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const {Panel} = Collapse

const ClubPresentation: React.FC = () => {
    const {t} = useTranslation("club")
    return (
        <div key="desktop-display" className="hidden-scroller w-full md:overflow-y-auto" style={{height: 400}}>
            <Collapse
                className="border-b-0 border-t rounded-lg shadow-md"
                defaultActiveKey={["2"]}
                bordered={false}
                expandIconPosition="right"
                expandIcon={({isActive}) =>
                    <FontAwesomeIcon icon={faChevronRight} className="text-gray-600 font-bold text-sm" transform={{ rotate: isActive ? 90: 0 }}/>
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
                    <GalleriesPreview/>
                </Panel>
            </Collapse>
        </div>

    )
}

export default ClubPresentation
