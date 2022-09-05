import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faUserAstronaut} from "@fortawesome/free-solid-svg-icons"
import {useTranslation} from "react-i18next"


const NotFound: React.FC = () => {
    const {t} = useTranslation("error")

    return (
        <div className="w-full h-full mx-auto">
            <div className="mt-10 mb-2 mx-auto flex flex-col items-center justify-center text-2xl text-gray-400">
                <FontAwesomeIcon icon={faUserAstronaut} size="8x" className="block my-3"/>

                <h3 className="font-bold text-gray-400 text-6xl">404</h3>
                <span className="text-center mt-5">
                    {t(`not_found.${Math.floor(Math.random() * 3)}`)}
                </span>
            </div>
        </div>
    )
}

export default NotFound
