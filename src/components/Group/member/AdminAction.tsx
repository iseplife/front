import React from "react"
import {IconFA} from "../../Common/IconFA"

type MemberActionProps = {
    onDemote: () => void
    onDelete: () => void
}
const AdminAction: React.FC<MemberActionProps> = ({onDelete, onDemote}) => (
    <span className="text-gray-400">
        <IconFA className="ml-3 mr-1 cursor-pointer hover:text-gray-600" name="fa-arrow-down" onClick={onDemote}/>
        <IconFA className="mx-1 cursor-pointer hover:text-red-500" name="fa-trash-alt" type="regular" onClick={onDelete}/>
    </span>
)

export default AdminAction