import React, {CSSProperties, useCallback, useState} from "react";
import {Post as PostType, PostCreation, PostUpdate} from "../../data/post/types";
import {getFeedPost} from "../../data/feed";
import InfiniteScroller, {loaderCallback} from "../Common/InfiniteScroller";
import Post from "../Post";
import PostForm from "../Post/PostForm";
import { deletePost, updatePost} from "../../data/post";
import {Divider} from "antd";

type FeedProps = {
    id: number
    allowPublication?: boolean
    style?: CSSProperties
    className?: string
}
const Feed: React.FC<FeedProps> = ({id, allowPublication, style, className}) => {
    const [posts, setPosts] = useState<PostType[]>([])
    const [editPost, setEditPost] = useState<number>(0)
    const [fetching, setFetching] = useState<boolean>(false)

    const loadMorePost: loaderCallback = useCallback(async (count: number) => {
        setFetching(true)
        const res = await getFeedPost(id, count)
        setPosts(posts => [...posts, ...res.data.content])
        setFetching(false)

        return res.data.last
    }, [id])

    const sendPost = async (post: PostCreation) => {
        const res = await createPost(post)
        if (res.status === 200) {
            setPosts(prevPosts => [res.data, ...prevPosts])
            return true
        }
        return false
    }

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
                    publicationDate: postUpdate.publicationDate.getTime(),
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
            <Divider className="font-dinotcb text-gray-500 text-lg" orientation="left">Publications</Divider>
            {allowPublication && (
                <PostForm feedId={id} sendPost={sendPost}/>
            )}

            <InfiniteScroller watch="DOWN" callback={loadMorePost} loading={<CardTextSkeleton loading={fetching} number={3} className="mb-3 mt-3"/>}>
                {posts.map((p) => (
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