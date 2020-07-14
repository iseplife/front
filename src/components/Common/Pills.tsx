import React, {CSSProperties} from "react"
import {useTranslation} from "react-i18next"

interface PillsProps {
    status: boolean
    event?: boolean
    style?: CSSProperties
    className?: string
}

const Pills: React.FC<PillsProps> = ({status, event, style, className}) => {
    const {t} = useTranslation("common")
    return (
        <span style={style}
            className={`inline-flex items-center font-semibold rounded-full px-2 my-1 ${status ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"} ${className}`}>
            {status ? t("pills.status_active") : event ? t("pills.status_passed") : t("pills.status_archived")}
        </span>
    )
}

Pills.defaultProps = {
    event: false,
    className: ""
}

export default Pills