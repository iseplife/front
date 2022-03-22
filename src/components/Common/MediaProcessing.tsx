import React from "react"
import {useTranslation} from "react-i18next"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSpinner} from "@fortawesome/free-solid-svg-icons"


const MediaProcessing: React.FC = () => {
    const {t} = useTranslation()

    return (
        <div className="bg-gray-300 overflow-hidden mx-2 flex-grow flex flex-col items-center rounded">
            <div className="m-3 text-slate-400 h-full ">
                <FontAwesomeIcon icon={faSpinner} spin className="w-full" size="4x"/>
                <div className="font-bold pt-4">
                    {t("media_processing")}
                </div>
            </div>
        </div>
    )
}

export default MediaProcessing