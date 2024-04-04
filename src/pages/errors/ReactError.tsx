import React, { useCallback } from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFaceDizzy} from "@fortawesome/free-regular-svg-icons"
import {useTranslation} from "react-i18next"


const ReactError: React.FC = () => {
    const {t} = useTranslation(["error", "common"])

    const refresh = useCallback(() => {
        window.history.back()
        setTimeout( function() {  window.location.reload() }, 200)
    }, [])

    return (
        <div className="w-full h-full mx-auto">
            <div className="mt-10 mb-2 mx-auto flex flex-col items-center justify-center text-2xl text-gray-400">
                <FontAwesomeIcon icon={faFaceDizzy} size="7x" className="block my-3"/>

                <h3 className="font-bold text-gray-400 text-6xl">{t("apologize")}</h3>
                <span className="text-center font-bold ">
                    {t(`error_encountered.${Math.floor(Math.random() * 3)}`)}
                </span>
                <span className="text-center text-lg mt-6">
                    {t("working_on_it")}
                </span>
                <div className="flex justify-center mt-2">
                    <button
                        onClick={refresh}
                        className="
                            bg-indigo-400 rounded-full px-4 py-2 mt-2 font-semibold text-base
                            text-white hover:bg-indigo-500 hover:shadow-sm transition-all
                        "
                    >
                        {t("common:back")}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReactError
