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
        <div key="desktop-display" className="w-full">
            <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white my-5">
                <span className="text-neutral-900 font-semibold text-base">{t("about")}</span>
                <About/>
            </div>
            <div className="flex-col px-4 py-3 shadow-sm rounded-lg bg-white my-5 hidden sm:flex">
                <span className="text-neutral-900 font-semibold text-base">{t("galleries")}</span>
                <GalleriesPreview/>
            </div>
        </div>

    )
}

export default ClubPresentation
