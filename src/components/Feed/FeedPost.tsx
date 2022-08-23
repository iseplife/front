import { isAfter } from "date-fns"
import { useCallback } from "react"
import { feedsManager } from "../../datamanager/FeedsManager"
import Post, { PostProps } from "../Post"

type FeedPostProps = {
    firstLoaded: number
    error: boolean
    setEditPost: (index: number) => void
    feedId?: number
    isEdited: boolean
} & Omit<Omit<Omit<PostProps, "toggleEdition">, "isEdited">, "feedId">

const FeedPost: React.FC<FeedPostProps> = (props) => {
    const p = props.data

    const toggleEdition = useCallback((toggle: boolean) => props.setEditPost(toggle ? p.id : 0), [])

    return <>{(isAfter(p.publicationDate, Date.now()) || p.publicationDateId <= props.firstLoaded) && (!props.error || feedsManager.isFresh(p, props.feedId)) &&
        <div
            className={`${!feedsManager.isFresh(p, props.feedId) && "opacity-60 pointer-events-none"} py-2`}
        >
            <Post
                feedId={props.feedId}
                data={p}
                toggleEdition={toggleEdition}
                isEdited={props.isEdited}
                onDelete={props.onDelete}
                onPin={props.onPin}
                onUpdate={props.onUpdate}
                className={props.className}
                forceShowComments={props.forceShowComments}
                noPinned={props.noPinned}
                selected={props.selected}
            />
        </div>
    }</>
}

export default FeedPost