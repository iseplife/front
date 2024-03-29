import React from "react"
import {FeedContext, FeedType} from "../../../data/feed/types"
import PostEventTag from "./PostEventTag"
import PostGroupTag from "./PostGroupTag"

interface PostContextTagProps {
    context: FeedContext,
}

export const PostContextTag: React.FC<PostContextTagProps> = ({context}) => {
    switch (context.type){
        case FeedType.EVENT:
            return <PostEventTag context={context} />
        case FeedType.GROUP:
            return <PostGroupTag context={context} />
        case FeedType.CLUB:
        case FeedType.STUDENT:
        default: {
            return null
        }
    }
}