import React, { useContext } from "react"
import {useTranslation} from "react-i18next"
import { Link } from "react-router-dom"
import { AppContext } from "../../../context/app/context"

const Discovery: React.FC = () => {
    const { t } = useTranslation("discovery")
    const { state: { user } } = useContext(AppContext)
    return (
        <div className="container mx-auto px-4 font-bold py-40 block md:flex">
            <div>
                <div className="flex text-4xl items-center">
                    <div className="text-neutral-600">Bonjour</div>
                    <img src="/img/icons/hello.svg" className="ml-3 w-11 h-11 mt-1" />
                </div>
                <div className="text-indigo-400 text-6xl">{ user.firstName }</div>
            </div>
            <div className="flex text-lg ml-auto mr-0 items-center mt-6 md:mt-0 text-center">
                <Link to="/">
                    <div className="bg-indigo-400 text-white rounded-xl w-48 py-[11.5px] grid place-items-center mr-5">
                        Mon Feed
                    </div>
                </Link>
                <Link to={{pathname: "https://github.com/iseplife"}} target="_blank">
                    <div className="border-indigo-400 text-indigo-400 border-[3.5px] rounded-xl w-48 py-2 grid place-items-center">
                        Voir sur GitHub
                    </div>
                </Link>
            </div>
        </div>
    )
}
export default Discovery