import React, { useContext } from "react"
import About from "../About"
import {useTranslation} from "react-i18next"
import GalleriesPreview from "../../Gallery/GalleriesPreview"
import { ClubContext } from "../../../context/club/context"
import { getClubGalleries } from "../../../data/club"
import ClubPresentationSkeleton from "../Skeleton/ClubPresentationSkeleton"


const ClubPresentation: React.FC = () => {
    const {t} = useTranslation(["club", "gallery"])
    const { club: { id } } = useContext(ClubContext)

    return (
        <div key="desktop-display" className="w-full">
            { id ?
                <>
                    <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white mb-5 mt-5 sm:mt-0">
                        <span className="text-neutral-900 font-semibold text-base">{t("about")}</span>
                        <About/>
                    </div>
                    <GalleriesPreview getGalleriesCallback={(page) => getClubGalleries(id, page)} />
                </> :
                <ClubPresentationSkeleton />
            }

        </div>

    )
}

export default ClubPresentation
