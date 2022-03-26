import {faBell} from "@fortawesome/free-regular-svg-icons"
import {faBell as faSolidBell, faCheck} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React, {useCallback} from "react"
import {subscribe} from "../../data/subscription"
import {SubscribableType} from "../../data/subscription/SubscribableType"

interface SubscriptionExtensiveButtonProps {
    id: number
    type: SubscribableType
    extensive: boolean
    updateExtensive: (extensive: boolean) => void
}

const SubscriptionExtensiveButton: React.FC<SubscriptionExtensiveButtonProps> = ({ id, type, extensive, updateExtensive }) => {
    const handleExtensive = useCallback(() => {
        subscribe(id, type, !extensive).then(() => {
            updateExtensive(!extensive)
        })
    }, [extensive, id, type])

    return (
        <div className="w-12 grid place-items-center relative ml-0 mr-auto h-10">
            <FontAwesomeIcon
                onClick={handleExtensive}
                icon={extensive ? faSolidBell : faBell}
                className="text-indigo-400 text-2xl cursor-pointer hover:text-opacity-90"
            />
            {extensive && (
                <FontAwesomeIcon
                    icon={faCheck}
                    className="top-1.5 right-[3px] pointer-events-none text-indigo-400 cursor-pointer text-sm absolute transform scale-75"
                />
            )}
        </div>
    )
}

export default SubscriptionExtensiveButton