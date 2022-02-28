import React, {CSSProperties, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react"
import {EmbedEnumType, Post as PostType, PostUpdate} from "../../data/post/types"
import {getFeedPost, getFeedPostPinned} from "../../data/feed"
import InfiniteScroller, {loaderCallback} from "../Common/InfiniteScroller"
import Post from "../Post"
import {getAuthorizedAuthors} from "../../data/post"
import {Divider, message, Modal} from "antd"
import CardTextSkeleton from "../Skeletons/CardTextSkeleton"
import {useTranslation} from "react-i18next"
import BasicPostForm from "../Post/Form/BasicPostForm"
import PostCreateForm from "../Post/Form/PostCreateForm"
import {faChartBar, faImages, faPaperclip, faVideo} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faNewspaper} from "@fortawesome/free-regular-svg-icons"
import {getWSService} from "../../realtime/services/WSService"
import WSFeedService from "../../realtime/services/WSFeedService"
import {AppContext} from "../../context/app/context"
import {FeedContext} from "../../context/feed/context"
import { Author } from "../../data/request.type"
import "./Feed.css"

type FeedProps = {
    loading?: boolean,
    id?: number
    allowPublication?: boolean
    style?: CSSProperties
    className?: string
}
const Feed: React.FC<FeedProps> = ({ loading, id, allowPublication, style, className }) => {
    const { state: { user } } = useContext(AppContext)
    const { t } = useTranslation(["common", "post"])
    const [posts, setPosts] = useState<PostType[]>([])
    const [postsPinned, setPostsPinned] = useState<PostType[]>([])

    const [editPost, setEditPost] = useState<number>(0)
    const [empty, setEmpty] = useState<boolean>(false)
    const [fetching, setFetching] = useState<boolean>(false)
    const [completeFormType, setCompleteFormType] = useState<EmbedEnumType | undefined>()
    const [authors, setAuthors] = useState<Author[]>([])

    const loadMorePost: loaderCallback = useCallback(async (count: number) => {
        setFetching(true)
        if (loading)
            return new Promise<boolean>(() => undefined)
        const res = await getFeedPost(id, count)
        setPosts(posts => [...posts, ...res.data.content])
        setFetching(false)

        if (count === 0 && res.data.content.length === 0 && postsPinned.length == 0)
            setEmpty(true)

        return res.data.last
    }, [id, loading])

    const onPostCreation = useCallback((post: PostUpdate) => (
        setPosts(prevPosts => [...prevPosts,
            {
                ...post,
                feedId: id!,
                creationDate: new Date(),
                liked: false,
                nbComments: 0,
                nbLikes: 0,
                hasWriteAccess: true
            }
        ])
    ), [])

    const onPostRemoval = useCallback(async (id: number) => {
        setPosts(posts => posts.filter(p => p.id !== id))
        message.success(t("remove_item.complete"))
    }, [])

    const onPostPin = useCallback((id: number, pinned: boolean) => {
        if (pinned) {
            const index = posts.findIndex(p => p.id === id)
            const pinnedPost = { ...posts[index], pinned: true }

            // We move post into pinned posts while removing it from common posts
            setPostsPinned(prev => (
                [...prev, pinnedPost].sort((a, b) => (
                    a.publicationDate.getTime() - b.publicationDate.getTime()
                )))
            )
            setPosts(prev => prev.filter((p, i) => i !== index))
            message.success(t("post:post_pinned"))
        } else {
            const index = postsPinned.findIndex(p => p.id === id)
            const unpinnedPost = { ...postsPinned[index], pinned: false }

            // We move post into common posts while removing it from pinned posts
            setPosts(prev => (
                [...prev, unpinnedPost].sort((a, b) => (
                    a.publicationDate.getTime() - b.publicationDate.getTime()
                )))
            )
            setPostsPinned(prev => prev.filter((p, i) => i !== index))
            message.success(t("post:post_unpinned"))
        }
    }, [posts, postsPinned])

    const onPostUpdate = useCallback((id: number, postUpdate: PostUpdate) => {
        setPosts(posts => posts.map(p => p.id === id ?
            { ...p, ...postUpdate } : p
        ))
        setEditPost(0)
        message.success(t("update_item.complete"))
    }, [])

    useEffect(() => {
        if (id) {
            getFeedPostPinned(id).then(res => {
                setPostsPinned(res.data)
                if (res.data.length !== 0)
                    setEmpty(false)
            })
        }

        getAuthorizedAuthors().then(res => {
            setAuthors(res.data)
        })
    }, [id])

    useEffect(() => {
        if (id !== undefined) {
            getWSService(WSFeedService).subscribe(id)
            return () => getWSService(WSFeedService).unsubscribe(id)
        }
    }, [id])

    const feedElement = useRef<HTMLDivElement>(null)

    const feedMargin = useMemo(() => feedElement?.current && parseInt(getComputedStyle(feedElement?.current).marginLeft) * 2 + 1, [feedElement?.current])

    return (
        <FeedContext.Provider value={{authors}}>
            <div className={`${className}`} style={{ ...style, maxWidth: `calc(100vw - ${feedMargin}px)` }} ref={feedElement}>
                <Divider className="text-gray-700 text-lg" orientation="left">Publications</Divider>
                {allowPublication && (
                    <BasicPostForm user={user} feedId={id} onPost={onPostCreation}>
                        <div className="grid grid-cols-4 gap-2.5 items-center text-xl mt-1 -mb-2">
                            <div
                                onClick={() => setCompleteFormType(EmbedEnumType.IMAGE)}
                                className="w-10 h-10 justify-center items-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer group xsm"
                            >
                                <FontAwesomeIcon
                                    icon={faImages}
                                    className="text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors"
                                />
                            </div>
                            <div
                                onClick={() => setCompleteFormType(EmbedEnumType.VIDEO)}
                                className="w-10 h-10 justify-center items-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer group xsm"
                            >
                                <FontAwesomeIcon
                                    icon={faVideo}
                                    className="text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors"
                                />
                            </div>
                            <div
                                onClick={() => setCompleteFormType(EmbedEnumType.DOCUMENT)}
                                className="flex w-10 h-10 justify-center items-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer group xsm-span"
                            >
                                <FontAwesomeIcon
                                    icon={faPaperclip}
                                    className="text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors"
                                />
                            </div>
                            <div
                                onClick={() => setCompleteFormType(EmbedEnumType.POLL)}
                                className="flex w-10 h-10 justify-center items-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer group xsm-span"
                            >
                                <FontAwesomeIcon
                                    icon={faChartBar}
                                    className="text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors"
                                />
                            </div>
                            {completeFormType && (
                                <Modal
                                    className="md:w-1/2 w-4/5"
                                    visible={true}
                                    footer={null}
                                    title={<span className="text-gray-800 font-bold text-2xl">{t("post:create")}</span>}
                                    onCancel={() => setCompleteFormType(undefined)}
                                >
                                    <PostCreateForm
                                        type={completeFormType}
                                        feed={id}
                                        user={user}
                                        onSubmit={onPostCreation}
                                        onClose={() => setCompleteFormType(undefined)}
                                    />
                                </Modal>
                            )}
                        </div>
                    </BasicPostForm>
                )}

                <div
                    className="ant-divider ant-divider-horizontal ant-divider-with-text ant-divider-with-text-center text-gray-700 text-opacity-60 text-base cursor-pointer hover:bg-gray-500 hover:bg-opacity-5 p-2 rounded-lg transition-colors">
                    <div className="ant-divider-inner-text">3 nouveaux posts</div>
                </div>

                <InfiniteScroller
                    watch="DOWN" callback={loadMorePost} empty={empty}
                    loadingComponent={<CardTextSkeleton loading={fetching} number={3} className="my-3"/>}
                >
                    {empty ?
                        <div className="mt-10 mb-2 flex flex-col items-center justify-center text-xl text-gray-400">
                            <FontAwesomeIcon icon={faNewspaper} size="8x" className="block"/>
                            <span className="text-center">{t("empty_feed")}</span>
                        </div>
                        : (
                            <>
                                {postsPinned.length !== 0 && (
                                    <>
                                        {postsPinned.map(p => (
                                            <Post
                                                feedId={id}
                                                key={p.id} data={p}
                                                onDelete={onPostRemoval}
                                                onUpdate={onPostUpdate}
                                                onPin={onPostPin}
                                                toggleEdition={(toggle) => setEditPost(toggle ? p.id : 0)}
                                                isEdited={editPost === p.id}
                                            />
                                        ))}
                                        <Divider className="text-gray-700"/>
                                    </>
                                )}

                                {posts.map(p => (
                                    <Post
                                        feedId={id}
                                        key={p.id} data={p}
                                        onDelete={onPostRemoval}
                                        onUpdate={onPostUpdate}
                                        onPin={onPostPin}
                                        toggleEdition={(toggle) => setEditPost(toggle ? p.id : 0)}
                                        isEdited={editPost === p.id}
                                    />
                                ))}
                            </>
                        )
                    }
                </InfiniteScroller>
            </div>
        </FeedContext.Provider>
    )
}

Feed.defaultProps = {
    allowPublication: true,
    className: "",
}

export default Feed
