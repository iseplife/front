import React, {useCallback, useContext, useEffect, useMemo, useState} from "react"
import {Post as PostType, PostUpdate} from "../../data/post/types"
import Embed from "./Embed"
import {Divider, Modal} from "antd"
import {useTranslation} from "react-i18next"
import {toggleThreadLike} from "../../data/thread"
import {format, isFuture} from "date-fns"
import CommentList from "../Comment/CommentList"
import {AvatarSizes} from "../../constants/MediaSizes"
import StudentAvatar from "../Student/StudentAvatar"
import PostEditForm from "./Form/PostEditForm"
import {faHeart as faSolidHeart, faThumbtack} from "@fortawesome/free-solid-svg-icons"
import {faHeart, faCommentAlt} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {formatDateWithTimer} from "../../util"
import PostToolBar from "./PostToolBar"
import {deletePost, pinPost} from "../../data/post"
import DropdownPanel from "../Common/DropdownPanel"
import { AppContext } from "../../context/app/context"
//@ts-ignore
import { getPastelColor } from "pastel-color"
import { Link } from "react-router-dom"

type PostProps = {
    data: PostType
    feedId: number | undefined,
    isEdited: boolean
    forceShowComments?: boolean
    toggleEdition: (toggle: boolean) => void
    onPin: (id: number, pinned: boolean) => void
    onDelete: (id: number) => Promise<void>
    onUpdate: (id: number, postUpdate: PostUpdate) => void
}

const Post: React.FC<PostProps> = ({data, feedId, isEdited, forceShowComments, onPin, onDelete, onUpdate, toggleEdition}) => {
    const {t} = useTranslation(["common", "post"])
    const [liked, setLiked] = useState<boolean>(data.liked)
    const [likes, setLikes] = useState<number>(data.nbLikes)
    const [showComments, setShowComments] = useState<boolean>(!!(forceShowComments || (data.nbComments == 1 && data.trendingComment)))
    const [showEditMenu, setShowEditMenu] = useState<boolean>(false)
    const [noTrendingComment, setNoTrendingComment] = useState<boolean>(false)
    const [alreadyMore, setAlreadyMore] = useState<boolean>(false)
    const { state: { user: { groups } } } = useContext(AppContext)
    
    const group = useMemo(() => groups.find(group => group.feedId == data.feedId), [groups, data.feedId])

    const confirmDeletion = useCallback(() => {
        Modal.confirm({
            title: t("remove_item.title"),
            content: t("remove_item.content"),
            okText: "Ok",
            cancelText: t("cancel"),
            onOk: async () => {
                deletePost(data.id)
                onDelete(data.id)
            }
        })
    }, [data.id, t, onDelete])

    const confirmUpdate = useCallback((updatedPost: PostUpdate) => {
        onUpdate(data.id, updatedPost)
    }, [data.id, onUpdate])

    const togglePin = useCallback(async () => {
        pinPost(data.id, !data.pinned).then(() => {
            onPin(data.id, !data.pinned)

        })
    }, [data.id, data.pinned, onPin])

    const toggleLike = useCallback(async (id: number) => {
        const res = await toggleThreadLike(id)
        if (res.status === 200) {
            setLiked(res.data)
            setLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1)
        }
    }, [])

    let post!: HTMLDivElement
    useEffect(() => {
        //Petite opti
        const scrollListener = () => {
            const boundings = post.getBoundingClientRect()
            if (boundings.bottom < -200)
                post.style.visibility = "hidden"
            else
                post.style.visibility = ""
        }

        const main = document.getElementById("main")
        main?.addEventListener("scroll", scrollListener)

        return () => {
            main?.removeEventListener("scroll", scrollListener)
        }
    }, [data.id])

    const [formattedDate, setFormattedDate] = useState<string>("")
    useEffect(() => formatDateWithTimer(data.publicationDate, t, setFormattedDate), [data.publicationDate])

    useEffect(() => {
        if (showEditMenu) {
            const onClick = () => setShowEditMenu(false)
            window.addEventListener("click", onClick)
            return () => {
                window.removeEventListener("click", onClick)
            }
        }
    }, [showEditMenu])

    useEffect(() => {
        if (!showComments && alreadyMore)
            setNoTrendingComment(true)
        else if (showComments) {
            setAlreadyMore(true)
            setShowComments(true)
        }
    }, [showComments])

    return (
        <div>
            {isEdited && (
                <Modal
                    className="md:w-1/2 w-4/5"
                    visible={true}
                    footer={null}
                    title={<span className="text-gray-800 font-bold text-2xl">{t("post:edit")}</span>}
                    onCancel={() => toggleEdition(false)}
                >
                    <PostEditForm post={data} onEdit={confirmUpdate} onClose={() => toggleEdition(false)}/>
                </Modal>
            )}
            <div className="flex flex-col p-4 shadow-sm rounded-lg bg-white my-5" ref={ele => {
                post = ele ?? post
            }}>
                <div className="w-full flex justify-between mb-1">
                    <div className="flex">
                        <StudentAvatar
                            id={data.author.id}
                            name={data.author.name}
                            picture={data.author.thumbnail}
                            pictureSize={AvatarSizes.THUMBNAIL}
                            showPreview
                            size="default"
                        />
                        <div className="items-center ml-2">
                            <div className="font-bold -mb-0.5 -mt-0.5">{data.author.name}</div>
                            <div className="text-xs whitespace-nowrap">
                                {isFuture(data.publicationDate) ? `${t("post:planned_for")} ${format(new Date(data.publicationDate), "dd/MM/yy, HH:mm")}` : formattedDate}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-end items-center text-lg -mt-4 -mr-1.5 min-w-0 ml-2">
                        {group && !feedId &&
                            <Link to={`/group/${group.id}`} className="min-w-0">
                                <div className="flex text-sm rounded px-2 py-0.5 font-medium hover:shadow-sm transition-shadow" title={t("post:posted_in_group", { group: group.name })} style={{backgroundColor: getPastelColor(group.name).hex}}>
                                    <div className="text-white text-ellipsis whitespace-nowrap overflow-hidden">{group.name}</div>
                                </div>
                            </Link>
                        }
                        {data.pinned && (
                            <FontAwesomeIcon
                                icon={faThumbtack}
                                className="mr-2.5 text-gray-500 ml-1"
                            />
                        )}
                        {data.hasWriteAccess && (
                            <DropdownPanel
                                panelClassName="w-32 right-0 lg:left-0"
                                closeOnClick={true}
                                buttonClassName="mr-0 ml-1"
                            >
                                <PostToolBar
                                    pinned={data.pinned}
                                    triggerPin={togglePin}
                                    triggerEdition={() => toggleEdition(true)}
                                    triggerDeletion={confirmDeletion}
                                />
                            </DropdownPanel>
                        )}
                    </div>
                </div>
                <div>
                    <span>{data.description}</span>
                    {data.embed && <div className="mt-2"><Embed embed={data.embed} post={data}/></div>}
                </div>
                <div className="flex flex-row text-gray-600 justify-between mt-1 -mb-2.5">
                    <div className="items-center text-gray-400 grid grid-cols-2 w-full mr-5 text-center">
                        <span
                            className="group flex items-center justify-center cursor-pointer hover:text-indigo-500 mr-3 text-xl transition-colors duration-100"
                            onClick={() => setShowComments(!showComments)}
                        >
                            <div className="text-base mx-1.5 w-7 text-right">
                                {data.nbComments > 0 && data.nbComments}
                            </div>
                            <div
                                className="-ml-1 cursor-pointer rounded-full bg-indigo-700 bg-opacity-0 group-hover:bg-opacity-10 transition-colors duration-200 w-10 h-10 items-center flex justify-center">
                                <FontAwesomeIcon
                                    icon={faCommentAlt}
                                    size="1x"
                                />
                            </div>
                        </span>
                        <span
                            className="group flex items-center justify-center cursor-pointer mr-3 text-xl"
                            onClick={() => toggleLike(data.thread)}
                        >
                            <div className="text-base mx-1.5 w-7 text-right">
                                {likes > 0 && likes}
                            </div>
                            <div
                                className="-ml-1 cursor-pointer rounded-full bg-red-700 bg-opacity-0 group-hover:bg-opacity-10 transition-colors duration-200 w-10 h-10 items-center flex justify-center">
                                <FontAwesomeIcon
                                    icon={liked ? faSolidHeart : faHeart}
                                    className={`${liked ? "text-red-400" : "hover:text-red-600"} transition-colors`}
                                    size="1x"
                                />
                            </div>
                        </span>
                    </div>
                </div>
                {((data.trendingComment && !noTrendingComment) || showComments) && (
                    <>
                        <Divider className="mb-0 mt-4"/>
                        <CommentList
                            showMoreComments={() => setShowComments(true)}
                            showComments={showComments}
                            trendingComment={noTrendingComment ? undefined : data.trendingComment}
                            numberComments={data.nbComments}
                            id={data.thread}
                            depth={0}
                            loadComment={data.nbComments !== 0}/>
                    </>
                )}
            </div>
        </div>
    )
}

export default Post
