import React from "react"
import DiscoveryClub from "../../components/Discovery/DiscoveryClub"
import YearBook from "../../components/Discovery/YearBook"
import {useTranslation} from "react-i18next"

export const MOBILE_WIDTH = 500

interface SpacerProps {
    spacing?: number
}

export const HorizontalSpacer = (props: SpacerProps) => {
    const size: string = "my-" + (props.spacing || 2)
    return (
        <div className={size}/>
    )
}

const Discovery: React.FC = () => {
    const {t} = useTranslation("discovery")
    return (
        <div>
            <h1>{t("welcome")}</h1>
            <div className="w-5/6 sm:w-1/2 max-w-4xl mx-auto my-8 text-sm sm:text-2xl">
                {t("welcome_description")}
            </div>
            <DiscoveryClub/>
            <YearBook/>
        </div>
    )
}
export default Discovery