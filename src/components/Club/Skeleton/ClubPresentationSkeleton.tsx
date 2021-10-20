import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronRight} from "@fortawesome/free-solid-svg-icons"
import {Collapse, Skeleton} from "antd"
import {useTranslation} from "react-i18next"
import GalleriesPreviewSkeleton from "./GalleriesPreviewSkeleton"

const {Panel} = Collapse

const ClubPresentationSkeleton: React.FC = () => {
    const {t} = useTranslation("club")

    return (
        <div className="hidden-scroller w-full md:w-64 lg:w-1/4 md:overflow-y-auto" style={{height: 400}}>
            <Collapse
                className="border-b-0 border-t rounded-lg shadow-md"
                defaultActiveKey={["2"]}
                bordered={false}
                expandIconPosition="right"
                expandIcon={({isActive}) =>
                    <FontAwesomeIcon
                        icon={faChevronRight}
                        className="text-gray-600 font-bold text-sm"
                        transform={{rotate: isActive ? 90 : 0}}
                    />
                }
            >
                <Panel
                    key={1}
                    className="border-b-0 border-t-0"
                    header={<span className="text-gray-500">{t("about")}</span>}
                >
                    <div className="w-full">
                        <div className="flex flex-row items-center">
                            <Skeleton active title avatar={{shape: "circle"}} paragraph={false}/>
                        </div>
                    </div>
                </Panel>
                <Panel
                    key={2}
                    className="border-b-0 border-t"
                    header={<span className="text-gray-500">{t("galleries")}</span>}
                >
                    <GalleriesPreviewSkeleton />
                </Panel>
            </Collapse>
        </div>
    )
}
export default ClubPresentationSkeleton