import React, {CSSProperties, useCallback, useState} from "react"
import {EmbedEnumType, Post as PostType} from "../../data/post/types"
import {getFeedPost} from "../../data/feed"
import InfiniteScroller, {loaderCallback} from "../Common/InfiniteScroller"
import Post from "../Post"
import {deletePost} from "../../data/post"
import {Divider, Modal} from "antd"
import CardTextSkeleton from "../Club/Skeletons/CardTextSkeleton"
import {IconFA} from "../Common/IconFA"
import {useTranslation} from "react-i18next"
import BasicPostForm from "../Post/Form/BasicPostForm"
import PostCreateForm from "../Post/Form/PostCreateForm"

type FeedProps = {
    id: number
    allowPublication?: boolean
    style?: CSSProperties
    className?: string
}
const Feed: React.FC<FeedProps> = ({id, allowPublication, style, className}) => {
    const {t} = useTranslation(["common", "post"])
    const [posts, setPosts] = useState<PostType[]>([])
    const [editPost, setEditPost] = useState<number>(0)
    const [empty, setEmpty] = useState<boolean>(false)
    const [fetching, setFetching] = useState<boolean>(false)
    const [completeFormType, setCompleteFormType] = useState<EmbedEnumType | undefined>()

    const loadMorePost: loaderCallback = useCallback(async (count: number) => {
        setFetching(true)
        const res = await getFeedPost(id, count)
        setPosts(posts => [...posts, ...res.data.content])
        setFetching(false)

        if(count === 0 && res.data.content.length === 0)
            setEmpty(true)

        return res.data.last
    }, [id])

    const onPostCreation = useCallback((post) => (
        setPosts(prevPosts => [post, ...prevPosts])
    ), [])

    const onPostRemoval = async (id: number) => {
        const res = await deletePost(id)
        if (res.status === 200) {
            setPosts(posts => posts.filter(p => p.id !== id))
        }
    }

    const onPostUpdate = useCallback((id: number, postUpdate: PostType) => {
        setPosts(posts => posts.map(p => p.id === id ? {...postUpdate} : p))
        setEditPost(0)
    }, [])

    return (
        <div className={`${className}`} style={style}>
            <Divider className="font-dinotcb text-gray-700 text-lg" orientation="left">Publications</Divider>
            {allowPublication && (
                <BasicPostForm feedId={id} onPost={onPostCreation}>
                    <div className="flex items-center">
                        <div onClick={() => setCompleteFormType(EmbedEnumType.IMAGE)}>
                            <IconFA name="fa-images" className="text-gray-500 cursor-pointer mx-1 hover:text-gray-700"/>
                        </div>
                        <div onClick={() => setCompleteFormType(EmbedEnumType.VIDEO)}>
                            <IconFA name="fa-video" type="solid" className="text-gray-500 cursor-pointer mx-1 hover:text-gray-700"/>
                        </div>
                        <div onClick={() => setCompleteFormType(EmbedEnumType.DOCUMENT)}>
                            <IconFA name="fa-paperclip" type="solid" className="text-gray-500 cursor-pointer mx-1 hover:text-gray-700"/>
                        </div>
                        <div onClick={() => setCompleteFormType(EmbedEnumType.POLL)}>
                            <IconFA name="fa-chart-bar" className="cursor-pointer mx-1 hover:text-gray-700"/>
                        </div>
                        {completeFormType && (
                            <Modal
                                className="md:w-1/2 w-4/5"
                                visible={true}
                                footer={null}
                                title={<span className="text-gray-800 font-bold text-2xl">{t("post:create")}</span>}
                                onCancel={() => setCompleteFormType(undefined)}
                            >
                                <PostCreateForm type={completeFormType} feed={id} onSubmit={onPostCreation} onClose={() => setCompleteFormType(undefined)}/>
                            </Modal>
                        )}
                    </div>
                </BasicPostForm>
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
                            onDelete={onPostRemoval}
                            onUpdate={onPostUpdate}
                            toggleEdition={(toggle) => setEditPost(toggle ? p.id: 0)}
                            isEdited={editPost === p.id}
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
