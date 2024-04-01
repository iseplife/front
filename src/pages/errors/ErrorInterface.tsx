import React, { useCallback } from "react"
import {useTranslation} from "react-i18next"

interface ErrorInterfaceProps {
    error: string
    btnText?: string
    onClick?: () => void
}

const ErrorInterface: React.FC<ErrorInterfaceProps> = ({error, btnText, onClick: clickAction}) => {
    const {t} = useTranslation("common")

    const refresh = useCallback(() => {
        clickAction ? clickAction() : window.location.reload()
    }, [])
    return (
        <div className="w-full h-full ">
            <div className="flex flex-col text-center text-lg mt-5 sm:mt-20">
                <label className="text-neutral-800">{t(error)}</label>
                <div className="flex justify-center mt-2">
                    <button
                        onClick={refresh}
                        className="
                            bg-[#fe9200] rounded-full px-4 py-2 mt-2 font-semibold text-base
                            text-white hover:bg-[#e87a05] hover:shadow-sm transition-all
                        "
                    >
                        {btnText ?? t("retry")}
                    </button>
                </div>
            </div>

        </div>
    )
}

export default ErrorInterface
