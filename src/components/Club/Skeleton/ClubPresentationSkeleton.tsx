import React from "react"
import {Skeleton} from "antd"
import {useTranslation} from "react-i18next"
import GalleriesPreviewSkeleton from "./GalleriesPreviewSkeleton"


const ClubPresentationSkeleton: React.FC = () => {
    const {t} = useTranslation("club")

    return (
        <>
            <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white mb-5 mt-5 sm:mt-0">
                <span className="text-neutral-900 font-semibold text-base">{t("about")}</span>
                <Skeleton.Input className="w-full rounded my-1" active size="large"/>
            </div>
            <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white mb-5 mt-5 sm:mt-0">
                <div className="text-neutral-900 font-semibold text-base flex items-center -mt-1">
                    <span>{t("club:galleries")}</span>
                </div>

                <Skeleton.Input className="w-full rounded my-1 mt-3" active size="large"/>
                <Skeleton.Input className="w-full rounded my-1" active size="large"/>
            </div >
        </>
    )
}
export default ClubPresentationSkeleton