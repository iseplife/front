import React, { useCallback } from "react"
import {useTranslation} from "react-i18next"


const Maintenance: React.FC = () => {
    const {t} = useTranslation("common")

    const refresh = useCallback(() => {
        window.location.reload()
    }, [])
    return (
        <div className="w-full h-full ">
            <div className="flex flex-col text-center text-lg mt-5 sm:mt-20">
                <label className="text-neutral-800">{t("error:no_connection_retry")}</label>
                <div className="flex justify-center mt-2">
                    <button
                        onClick={refresh}
                        className="
                            bg-indigo-400 rounded-full px-4 py-2 mt-2 font-semibold text-base
                            text-white hover:bg-indigo-500 hover:shadow-sm transition-all
                        "
                    >
                        {t("retry")}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default Maintenance