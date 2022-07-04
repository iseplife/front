import React, { useCallback, useContext } from "react"
import About from "../About"
import {useTranslation} from "react-i18next"
import GalleriesPreview from "../../Gallery/GalleriesPreview"
import { ClubContext } from "../../../context/club/context"
import { getClubGalleries } from "../../../data/club"

const ClubPresentation: React.FC = () => {
    const {t} = useTranslation(["club", "gallery"])
    const { club: { id } } = useContext(ClubContext)

    const clubGalleriesCallback = useCallback((page?: number) => getClubGalleries(id, page), [getClubGalleries, id])

    return (
        <div key="desktop-display" className="w-full">
            <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white mb-5 mt-5 sm:mt-0">
                <span className="text-neutral-900 font-semibold text-base">{t("about")}</span>
                <About/>
            </div>
            <GalleriesPreview loading={!id} getGalleriesCallback={clubGalleriesCallback} />
        </div>

    )
}

export default ClubPresentation
