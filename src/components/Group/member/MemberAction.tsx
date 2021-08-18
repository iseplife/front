import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faArrowUp} from "@fortawesome/free-solid-svg-icons"
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons"

type MemberActionProps = {
    onPromote: () => void
    onDelete: () => void
}
const MemberAction: React.FC<MemberActionProps> = ({onDelete, onPromote}) => (
    <span className="text-gray-400">
        <FontAwesomeIcon icon={faArrowUp} className="ml-3 mr-1 cursor-pointer hover:text-gray-600" onClick={onPromote}/>
        <FontAwesomeIcon icon={faTrashAlt} className="mx-1 cursor-pointer hover:text-red-500" onClick={onDelete}/>
    </span>
)

export default MemberAction
