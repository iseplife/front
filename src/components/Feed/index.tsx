import React, {CSSProperties, useCallback, useEffect, useState} from "react"
import {EmbedEnumType, Post as PostType} from "../../data/post/types"
import {getFeedPost} from "../../data/feed"
import InfiniteScroller, {loaderCallback} from "../Common/InfiniteScroller"
import Post from "../Post"
import {deletePost} from "../../data/post"
import {Divider, Modal} from "antd"
import CardTextSkeleton from "../Club/Skeletons/CardTextSkeleton"
import {useTranslation} from "react-i18next"
import BasicPostForm from "../Post/Form/BasicPostForm"
import PostCreateForm from "../Post/Form/PostCreateForm"
import {faChartBar, faImages, faPaperclip, faVideo} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faNewspaper} from "@fortawesome/free-regular-svg-icons"
import { getWSService } from "../../realtime/services/WSService"
import WSFeedService from "../../realtime/services/WSFeedService"

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

    useEffect(() => {
        getWSService(WSFeedService).subscribe(id)
        return () => getWSService(WSFeedService).unsubscribe(id)
    }, [id])

    return (
        <div className={`${className}`} style={style}>
            <Divider className="text-gray-700 text-lg" orientation="left">Publications</Divider>
            {allowPublication && (
                <BasicPostForm feedId={id} onPost={onPostCreation}>
                    <div className="grid grid-cols-4 gap-2.5 items-center text-xl mt-1 -mb-2">
                        <div onClick={() => setCompleteFormType(EmbedEnumType.IMAGE)} className="flex w-10 h-10 justify-center items-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer group">
                            <FontAwesomeIcon icon={faImages} className="text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors"/>
                        </div>
                        <div onClick={() => setCompleteFormType(EmbedEnumType.VIDEO)} className="flex w-10 h-10 justify-center items-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer group">
                            <FontAwesomeIcon icon={faVideo} className="text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors"/>
                        </div>
                        <div onClick={() => setCompleteFormType(EmbedEnumType.DOCUMENT)} className="flex w-10 h-10 justify-center items-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer group">
                            <FontAwesomeIcon icon={faPaperclip} className="text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors"/>
                        </div>
                        <div onClick={() => setCompleteFormType(EmbedEnumType.POLL)} className="flex w-10 h-10 justify-center items-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer group">
                            <FontAwesomeIcon icon={faChartBar} className="text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors"/>
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

            <div className="ant-divider ant-divider-horizontal ant-divider-with-text ant-divider-with-text-center text-gray-700 text-opacity-60 text-base cursor-pointer hover:bg-gray-500 hover:bg-opacity-5 p-2 rounded-lg transition-colors">
                <div className="ant-divider-inner-text">3 nouveaux posts</div>
            </div>

            <InfiniteScroller watch="DOWN" callback={loadMorePost} empty={empty} loadingComponent={<CardTextSkeleton loading={fetching} number={3} className="my-3" />}>
                {empty ?
                    <div className="mt-10 mb-2 flex flex-col items-center justify-center text-xl text-gray-400">
                        <FontAwesomeIcon icon={faNewspaper} size="8x" className="block" />
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
