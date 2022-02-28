import React, { useCallback, useState } from "react"
import {Collapse} from "antd"
import About from "../About"
import {useTranslation} from "react-i18next"
import GalleriesPreview from "../../Gallery/GalleriesPreview"
import {faChevronRight} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

const {Panel} = Collapse

const ClubPresentation: React.FC = () => {
    const {t} = useTranslation(["club", "gallery"])
    const [galleriesVisible, setGalleriesVisible] = useState<boolean>(false)

    const setVisible = useCallback(() => setGalleriesVisible(true), [])

    return (
        <div key="desktop-display" className="w-full">
            <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white mb-5 mt-5 sm:mt-0">
                <span className="text-neutral-900 font-semibold text-base">{t("about")}</span>
                <About/>
            </div>
            <div className="flex-col px-4 py-3 shadow-sm rounded-lg bg-white my-5 hidden sm:flex">
                <div className="text-neutral-900 font-semibold text-base flex items-center -mt-1">
                    <span>{t("club:galleries")}</span>
                    <div onClick={setVisible}  className="ml-auto py-1 -mr-1 hover:bg-black/5 transition-colors px-2 rounded text-indigo-500 font-normal text-sm grid place-items-center cursor-pointer mt-1">
                        {t("gallery:see_all")}
                    </div>
                </div>
                <GalleriesPreview visible={galleriesVisible} setVisible={setGalleriesVisible} />
            </div>
        </div>

    )
}

export default ClubPresentation
