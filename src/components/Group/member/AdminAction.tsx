import React from "react"
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons"

type MemberActionProps = {
    onDemote?: () => void
    onPromote?: () => void
    onDelete: () => void
}
const AdminAction: React.FC<MemberActionProps> = ({onDelete, onDemote, onPromote}) => (
    <span className="text-gray-400 flex items-center">
        <FontAwesomeIcon icon={onPromote ? faArrowUp : faArrowDown} className="ml-1 mr-1 cursor-pointer hover:text-gray-600" onClick={onDemote ?? onPromote}/>
        <FontAwesomeIcon icon={faTrashAlt} className="mx-1 cursor-pointer hover:text-red-500" onClick={onDelete}/>
    </span>
)

export default AdminAction
