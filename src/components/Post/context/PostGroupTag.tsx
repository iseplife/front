import React from "react"
import {useTranslation} from "react-i18next"
import {Link} from "react-router-dom"
//@ts-ignore
import {getPastelColor} from "pastel-color"
import {useLiveQuery} from "dexie-react-hooks"
import {groupManager} from "../../../datamanager/GroupManager"

type PostGroupTagProps = {
    id: number
}
export const PostGroupTag: React.FC<PostGroupTagProps> = ({id}) => {
    const {t} = useTranslation("post")
    const group = useLiveQuery(() => groupManager.getGroupByFeedId(id), [id])

    return group ? (
        <Link to={`/group/${group.id}`} className="min-w-0">
            <div
                className="flex text-sm rounded px-2 py-0.5 font-medium hover:shadow-sm transition-shadow"
                title={t("post:posted_in_group", { group: group.name })}
                style={{backgroundColor: getPastelColor(group.name).hex}}
            >
                <div className="text-white text-ellipsis whitespace-nowrap overflow-hidden">{group.name}</div>
            </div>
        </Link>
    ): null
}

export default PostGroupTag