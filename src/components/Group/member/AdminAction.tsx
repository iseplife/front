import React, { useCallback } from "react"
import {faArrowDown, faArrowUp} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons"

type MemberActionProps = {
    onDemote?: () => void
    onPromote?: () => void
    onDelete: () => void
}
const AdminAction: React.FC<MemberActionProps> = ({ onDelete: _onDelete, onDemote: _onDemote, onPromote: _onPromote }) => {
    const onDelete = useCallback((e: React.MouseEvent) => (e.preventDefault(), _onDelete()), [_onDelete])
    const onPromoteDemote = useCallback((e: React.MouseEvent) => (e.preventDefault(), (_onPromote ?? _onDemote)?.()), [_onPromote, _onDemote])
    return (
        <span className="text-gray-400 flex items-center">
            <FontAwesomeIcon icon={_onPromote ? faArrowUp : faArrowDown} className="ml-1 mr-1 cursor-pointer hover:text-gray-600" onClick={onPromoteDemote} />
            <FontAwesomeIcon icon={faTrashAlt} className="mx-1 cursor-pointer hover:text-red-500" onClick={onDelete} />
        </span>
    )
}
    
export default AdminAction
