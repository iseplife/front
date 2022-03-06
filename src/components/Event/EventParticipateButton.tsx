import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import { Divider, Skeleton } from "antd"
import { Link } from "react-router-dom"


type EventParticipateButtonProps = {
    price: number | undefined
    ticketURL: string | undefined
    onClick?: () => void
}
const EventParticipateButton: React.FC<EventParticipateButtonProps> = ({ price, ticketURL, onClick }) => {
    const {t} = useTranslation("event")
    
    const button = <button onClick={onClick} className="px-3 py-2 rounded shadow-sm bg-indigo-400 text-white text-base font-medium cursor-pointer hover:shadow-md transition-shadow">
        {price && <>{price}€ - </>}{t("event:participate")}
    </button>
    return ticketURL ?
        <Link to={{ pathname: ticketURL }} target="_blank">
            {button}
        </Link>
        : button
}

export default EventParticipateButton
