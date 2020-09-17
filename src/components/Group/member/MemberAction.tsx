import React from "react"
import {IconFA} from "../../Common/IconFA"

type MemberActionProps = {
    onPromote: () => void
    onDelete: () => void
}
const MemberAction: React.FC<MemberActionProps> = ({onDelete, onPromote}) => (
    <span className="text-gray-400">
        <IconFA className="ml-3 mr-1 cursor-pointer hover:text-gray-600" name="fa-arrow-up" onClick={onPromote}/>
        <IconFA className="mx-1 cursor-pointer hover:text-red-500" name="fa-trash-alt" type="regular" onClick={onDelete}/>
    </span>
)

export default MemberAction