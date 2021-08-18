import React from "react"
import {useTranslation} from "react-i18next"
import {faTools} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


const Error: React.FC = () => {
    const {t} = useTranslation()
    return (
        <div className="w-full text-center text-gray-400 text-2xl">
            <FontAwesomeIcon icon={faTools} size="6x" className="block my-3"/>
            {t("error")}
        </div>
    )
}


export default Error
