import React from "react"
import DiscoveryClub from "../../../components/Discovery/DiscoveryClub"
import YearBook from "../../../components/Discovery/YearBook"
import {useTranslation} from "react-i18next"
import DiscoverPurpose from "../../../components/Discovery/DiscoveryPurpose"

const Discovery: React.FC = () => {
    const {t} = useTranslation("discovery")
    return (
        <div>
            <h1 className="text-center text-5xl font-bold text-indigo-500">{t("welcome")}</h1>
            <div className="w-9/12 sm:w-1/2 max-w-4xl mx-auto my-8 text-sm text-center">
                {t("welcome_description")}
            </div>
            <div className="my-2 flex justify-around">
                <DiscoverPurpose img="/img/party.svg" title={t("purposes.0.title")} description={t("purposes.0.description")} />
                <DiscoverPurpose img="/img/share.svg" title={t("purposes.1.title")} description={t("purposes.1.description")} />
                <DiscoverPurpose img="/img/inform.svg" title={t("purposes.2.title")} description={t("purposes.2.description")} />
            </div>
            <DiscoveryClub/>
            <YearBook/>
        </div>
    )
}
export default Discovery