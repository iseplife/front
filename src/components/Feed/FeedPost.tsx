import { useCallback, useMemo } from "react"
import { feedsManager } from "../../datamanager/FeedsManager"
import Post, { PostProps } from "../Post"

type FeedPostProps = {
    firstLoaded: number
    error: boolean
    setEditPost: (index: number) => void
    feedId?: number
    isEdited: boolean
    loadAnimation?: boolean
} & Omit<Omit<Omit<PostProps, "toggleEdition">, "isEdited">, "feedId">

const FeedPost: React.FC<FeedPostProps> = (props) => {
    const p = props.data

    const loadAnimation = useMemo(() => props.loadAnimation, [])

    const toggleEdition = useCallback((toggle: boolean) => props.setEditPost(toggle ? p.id : 0), [])

    return (
        <div
            className={`${!feedsManager.isFresh(p, props.feedId) && "opacity-60 pointer-events-none"} py-2 ${loadAnimation && "animate-fadeIn"}`}
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
    )
}

export default FeedPost