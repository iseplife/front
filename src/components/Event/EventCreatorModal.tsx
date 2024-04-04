import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faPlus} from "@fortawesome/free-solid-svg-icons"
import { Link } from "react-router-dom"

type EventModalFormProps = {
    onSubmit?: () => void
    className?: string
}
const EventCreatorModal: React.FC<EventModalFormProps> = ({onSubmit}) => {
    return (
        <>
            <div className="flex justify-center">
                <Link to="/event/create">
                    <button
                        className="
                            flex items-center mx-auto rounded-full bg-indigo-400 text-base
                            text-white cursor-pointer opacity-100 hover:opacity-80 duration-200 p-2
                        "
                    >
                        <FontAwesomeIcon icon={faPlus} className="w-4 h-4 block flex-shrink-0"/>
                    </button>
                </Link>
            </div>
        </>
    )
}
export default EventCreatorModal
