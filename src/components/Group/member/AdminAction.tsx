import React from "react"
import {faArrowDown} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons"

type MemberActionProps = {
    onDemote: () => void
    onDelete: () => void
}
const AdminAction: React.FC<MemberActionProps> = ({onDelete, onDemote}) => (
    <span className="text-gray-400">
        <FontAwesomeIcon icon={faArrowDown} className="ml-3 mr-1 cursor-pointer hover:text-gray-600" onClick={onDemote}/>
        <FontAwesomeIcon icon={faTrashAlt} className="mx-1 cursor-pointer hover:text-red-500" onClick={onDelete}/>
    </span>
)

export default AdminAction
