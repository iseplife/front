import React from "react"
import {useTranslation} from "react-i18next"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTools} from "@fortawesome/free-solid-svg-icons"


const Maintenance: React.FC = () => {
    const {t} = useTranslation("error")
    return (
        <div className="w-full h-full ">
            <div className="mt-10 mb-2 mx-auto flex flex-col items-center justify-center text-2xl text-gray-400">
                <FontAwesomeIcon icon={faTools} size="8x" className="block my-3"/>

                <h3 className="font-bold text-gray-400 text-6xl">{t("maintenance.title")}</h3>
                <span className="text-center mt-5">
                    {t(`maintenance.message.${Math.floor(Math.random() * 2)}`)}
                </span>
            </div>
        </div>
    )
}

export default Maintenance