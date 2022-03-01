import React, { useCallback, useContext, useState } from "react"
import {Collapse} from "antd"
import About from "../About"
import {useTranslation} from "react-i18next"
import GalleriesPreview from "../../Gallery/GalleriesPreview"
import {faChevronRight} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"
import { ClubContext } from "../../../context/club/context"
import { getClubGalleries } from "../../../data/club"

const {Panel} = Collapse

const ClubPresentation: React.FC = () => {
    const {t} = useTranslation(["club", "gallery"])
    const { club: { id } } = useContext(ClubContext)

    return (
        <div key="desktop-display" className="w-full">
            <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white mb-5 mt-5 sm:mt-0">
                <span className="text-neutral-900 font-semibold text-base">{t("about")}</span>
                <About/>
            </div>
            <GalleriesPreview elementId={id} getGalleriesCallback={getClubGalleries} />
        </div>

    )
}

export default ClubPresentation
