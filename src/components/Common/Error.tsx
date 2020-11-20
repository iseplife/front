import React from "react"
import {IconFA} from "./IconFA"
import {useTranslation} from "react-i18next"


const Error: React.FC = () => {
    const {t} = useTranslation()
    return (
        <div className="w-full text-center text-gray-400 text-2xl">
            <IconFA name="fa-tools" size="6x" className="block my-3"/>
            {t("error")}
        </div>
    )
}


export default Error