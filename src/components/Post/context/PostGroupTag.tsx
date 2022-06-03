import React from "react"
import {useTranslation} from "react-i18next"
import {Link} from "react-router-dom"
//@ts-ignore
import {getPastelColor} from "pastel-color"
import { FeedContext } from "../../../data/feed/types"

type PostGroupTagProps = {
    context: FeedContext
}
export const PostGroupTag: React.FC<PostGroupTagProps> = ({context}) => {
    const {t} = useTranslation("post")

    return context ? (
        <Link to={`/group/${context.id}`} className="min-w-0">
            <div
                className="flex text-sm rounded px-2 py-0.5 font-medium hover:shadow-sm transition-shadow"
                title={t("post:posted_in_group", { group: context.name })}
                style={{backgroundColor: getPastelColor(context.name).hex}}
            >
                <div className="text-white text-ellipsis whitespace-nowrap overflow-hidden">{context.name}</div>
            </div>
        </Link>
    ): null
}

export default PostGroupTag