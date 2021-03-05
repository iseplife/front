import React, {CSSProperties, useCallback, useState} from "react"
import {Post as PostType, PostUpdate} from "../../data/post/types"
import {getFeedPost} from "../../data/feed"
import InfiniteScroller, {loaderCallback} from "../Common/InfiniteScroller"
import Post from "../Post"
import PostForm from "../Post/PostForm"
import {deletePost, updatePost} from "../../data/post"
import {Divider} from "antd"
import CardTextSkeleton from "../Club/Skeletons/CardTextSkeleton"
import {IconFA} from "../Common/IconFA"
import {useTranslation} from "react-i18next"

type FeedProps = {
    id: number
    allowPublication?: boolean
    style?: CSSProperties
    className?: string
}
const Feed: React.FC<FeedProps> = ({id, allowPublication, style, className}) => {
    const {t} = useTranslation()
    const [posts, setPosts] = useState<PostType[]>([])
    const [editPost, setEditPost] = useState<number>(0)
    const [empty, setEmpty] = useState<boolean>(false)
    const [fetching, setFetching] = useState<boolean>(false)

    const loadMorePost: loaderCallback = useCallback(async (count: number) => {
        setFetching(true)
        const res = await getFeedPost(id, count)
        setPosts(posts => [...posts, ...res.data.content])
        setFetching(false)

        if(count === 0 && res.data.content.length === 0)
            setEmpty(true)

        return res.data.last
    }, [id])

    const removePost = async (id: number) => {
        const res = await deletePost(id)
        if (res.status === 200) {
            setPosts(posts => posts.filter(p => p.id !== id))
        }
    }

    const handlePostUpdate = async (id: number, postUpdate: PostUpdate) => {
        const res = await updatePost(id, postUpdate)
        if (res.status === 200) {
            setPosts(posts => posts.map(p => p.id === id ?
                {
                    ...p,
                    description: postUpdate.description,
                    publicationDate: postUpdate.publicationDate,
                    private: postUpdate.private
                }
                : p
            ))
            return true
        }
        return false
    }


    return (
        <div className={`${className} max-w-4xl`} style={style}>
            <Divider className="font-dinotcb text-gray-700 text-lg" orientation="left">Publications</Divider>
            {allowPublication && (
                <PostForm feedId={id} onPost={post => setPosts(prevPosts => [post, ...prevPosts])}/>
            )}

            <InfiniteScroller watch="DOWN" callback={loadMorePost} empty={empty} loadingComponent={<CardTextSkeleton loading={fetching} number={3} className="my-3" />}>
                {empty ?
                    <div className="mt-10 mb-2 flex flex-col items-center justify-center text-xl font-dinot text-gray-400">
                        <IconFA type="regular" name="fa-newspaper" size="8x" className="block"/>
                        <span className="text-center">{t("empty_feed")}</span>
                    </div>
                    : posts.map((p) => (
                        <Post
                            key={p.id} data={p}
                            onDelete={removePost}
                            onUpdate={handlePostUpdate}
                            onEdit={setEditPost}
                            editMode={editPost === p.id}
                        />
                    ))}
            </InfiniteScroller>
        </div>
    )
}

Feed.defaultProps = {
    allowPublication: true,
    className: "",
}

export default Feed