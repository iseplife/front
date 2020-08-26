import React from "react"
import {GroupPreview} from "../../data/group/types"
import {Link} from "react-router-dom"

type GroupListProps = {
    groups: GroupPreview[]
}
const GroupList: React.FC<GroupListProps> = ({groups}) => {
    return (
        <ul className="list-none ml-2">
            {groups.map(g => (
                <li className="my-2">
                    <Link to={`/group/${g.id}`} className="font-dinot text-gray-500 hover:text-gray-600">
                        {g.name}
                    </Link>
                </li>
            ))}
        </ul>
    )
}
export default GroupList