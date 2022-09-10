import React from "react"
import { useTranslation } from "react-i18next"
import LoadingSpinner from "../components/Common/LoadingSpinner"

interface LoadingPageProps {
    message?: string
}

const LoadingPage: React.FC<LoadingPageProps> = ({message}) => {
    const {t} = useTranslation("common")

    return (
        <div className="h-screen w-screen fixed top-0 overflow-hidden">
            <LoadingSpinner />
            <div className="top-1/2 absolute mt-32 text-center w-full text-xl px-5">
                {t(message ?? "loading")}
            </div>
        </div>
    )
}
export default LoadingPage