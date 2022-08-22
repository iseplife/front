import React, { useCallback, useContext } from "react"
import About from "../About"
import {useTranslation} from "react-i18next"
import { ClubContext } from "../../../context/club/context"
import { getClubEventsGalleries } from "../../../data/club"
import ClubEventsGalleriesPreview from "../../Gallery/ClubEventsGalleriesPreview"
import { ClubTab } from "../../../pages/default/club"

const ClubPresentation: React.FC<{ setTab: (tab: ClubTab) => void }> = ({setTab}) => {
    const {t} = useTranslation(["club", "gallery"])
    const { state: { club } } = useContext(ClubContext)

    const clubEventsGalleriesCallback = useCallback((page?: number) => getClubEventsGalleries(club!.id, page), [getClubEventsGalleries, club?.id])

    const openEventTab = useCallback(() => {
        setTab(ClubTab.EVENTS_TAB)
    }, [setTab])

    return (
        <div key="desktop-display" className="w-full">
            <div className="flex flex-col px-4 py-3 shadow-sm rounded-lg bg-white mb-5 mt-5 sm:mt-0">
                <span className="text-neutral-900 font-semibold text-base">{t("about")}</span>
                <About/>
            </div>
            <ClubEventsGalleriesPreview seeAll={openEventTab} loading={!club?.id} getGalleriesCallback={clubEventsGalleriesCallback} />
        </div>

    )
}

export default ClubPresentation
