import React, { useContext } from "react"
import {useTranslation} from "react-i18next"
import { Link } from "react-router-dom"
import DiscoveryClub from "../../../components/Discovery/DiscoveryClub"
import DiscoverPurpose from "../../../components/Discovery/DiscoveryPurpose"
import YearBook from "../../../components/Discovery/YearBook"
import { AppContext } from "../../../context/app/context"
import "./Discovery.css"

const Discovery: React.FC = () => {
    const { t } = useTranslation("discovery")
    const { state: { user } } = useContext(AppContext)
    return (<>
        <div className="z-0 pointer-events-none opacity-60 select-none">
            <img src="img/icons/floating/square.svg" className="absolute top-[450px] md:top-[400px] left-1/4" />
            <img src="img/icons/floating/camera.svg" className="absolute top-[450px] right-[10%] md:block hidden" />
            <img src="img/icons/floating/triangle.svg" className="absolute top-[520px] sm:top-[550px] right-[40%] translate-x-32" />
            <img src="img/icons/floating/star.svg" className="absolute top-[700px] left-[4%] hidden md:block" />
        </div>

        <div className="container mx-auto px-5 md:px-10 font-bold text-neutral-700">
            <div className="py-40 block md:flex mb-5 md:mb-12">
                <div>
                    <div className="flex text-4xl items-center">
                        Bonjour
                        <img src="/img/icons/hello.svg" className="ml-3 w-11 h-11 mt-1" />
                    </div>
                    <div className="text-indigo-400 text-6xl">{ user.firstName }</div>
                </div>
                <div className="flex gap-5 text-lg ml-auto mr-0 items-center mt-6 md:mt-0 text-center xsgrid">
                    <Link to="/">
                        <div className="bg-indigo-400 hover:bg-indigo-400/90 transition-colors text-white rounded-xl w-44 md:w-48 py-[11.5px] grid place-items-center">
                            { t("my_feed") }
                        </div>
                    </Link>
                    <Link to={{pathname: "https://github.com/iseplife"}} target="_blank">
                        <div className="border-indigo-400 hover:border-indigo-400/90 transition-colors text-indigo-400 hover:text-indigo-400/90 border-[3.5px] rounded-xl w-44 md:w-48 py-2 grid place-items-center">
                            { t("watch_github") }
                        </div>
                    </Link>
                </div>

            </div>
            <div>
                <div className="bg-indigo-400 rounded-full w-16 h-3"></div>
                <div className="text-2xl mt-2">{t("student_life")}</div>
            </div>
            <div className="grid gap-y-16 gap-x-10 grid-cols-1 lg:grid-cols-3 pt-20 md:pt-28 px-2 text-lg font-normal text-center">
                <DiscoverPurpose description={t("purposes.2.description")} img="event" />
                <DiscoverPurpose description={t("purposes.0.description")} img="network" />
                <DiscoverPurpose description={t("purposes.1.description")} img="people" />
            </div>
        </div>
        <div className="relative mb-20 z-0 pointer-events-none opacity-60 select-none">
            <img src="img/icons/floating/star.svg" className="absolute top-[20px] right-[10%]" />
            <img src="img/icons/floating/square.svg" className="absolute top-[75px] left-[30%]" />
        </div>
        <img src="img/wave.svg" draggable="false" className="mt-5 z-10 relative w-full select-none" />
        <div className="bg-indigo-400">
            <div className="container mx-auto px-5 md:px-10 font-bold text-white/[98%] pb-5">
                <div className="mb-5">
                    <div className="bg-white rounded-full w-16 h-3"></div>
                    <div className="text-2xl mt-2">{t("assos")}</div>
                </div>

                <DiscoveryClub />

                <div className="mb-5">
                    <div className="bg-white rounded-full w-16 h-3"></div>
                    <div className="text-2xl mt-2">{t("students")}</div>
                </div>

                <YearBook />
            </div>
        </div>
    </>)
}
export default Discovery