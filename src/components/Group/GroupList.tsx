import React from "react"
import {GroupPreview} from "../../data/group/types"
import {Link} from "react-router-dom"

type GroupListProps = {
    groups: GroupPreview[]
}
const GroupList: React.FC<GroupListProps> = ({groups}) => {
    return (
        <div className="flex md:flex-col flex-row hidden-scroller whitespace-no-wrap w-full overflow-x-auto m-0 md:ml-2 ">
            {groups.map(g => (
                <div key={g.id} className="m-1 px-2 rounded-full bg-gray-400 md:bg-transparent">
                    <Link to={`/group/${g.id}`} className="font-dinot text-white md:text-gray-500 hover:text-gray-600">
                        {g.name}
                    </Link>
                </div>
            ))}
        </div>
    )
}
export default GroupList