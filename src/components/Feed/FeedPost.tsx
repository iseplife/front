import { isAfter } from "date-fns"
import { useCallback, useEffect, useLayoutEffect, useRef } from "react"
import { feedsManager, ManagerPost } from "../../datamanager/FeedsManager"
import Post, { PostProps } from "../Post"

type FeedPostProps = {
    index: number
    windowWidth: number
    data: ManagerPost[]
    setSize: (index: number, height: number) => void
    firstLoaded: number
    error: boolean
    setEditPost: (index: number) => void
    feedId?: number
    isEdited: boolean
} & Omit<Omit<Omit<Omit<PostProps, "data">, "toggleEdition">, "isEdited">, "feedId">

const FeedPost: React.FC<FeedPostProps> = (props) => {
    const {index, windowWidth, data, setSize, firstLoaded, error, setEditPost, feedId, isEdited} = props
    const p = data[index]
    const rowRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const ele = rowRef.current!
        setSize(index, ele.getBoundingClientRect().height + 10)
    }, [setSize, index, windowWidth])

    const toggleEdition = useCallback((toggle: boolean) => setEditPost(toggle ? p.id : 0), [])

    useEffect(() => {
        console.log("create", index)
    }, [])

    return <>{(isAfter(p.publicationDate, Date.now()) || p.publicationDateId <= firstLoaded) && (!error || feedsManager.isFresh(p, feedId)) &&
        <div
            ref={rowRef}
            className={!feedsManager.isFresh(p, feedId) ? "opacity-60 pointer-events-none " : ""}
        >
            <Post
                feedId={feedId}
                data={p}
                toggleEdition={toggleEdition}
                isEdited={isEdited}
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