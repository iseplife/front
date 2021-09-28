import React, {useCallback, useEffect, useState} from "react"
import {Post as PostType} from "../../data/post/types"
import Embed from "./Embed"
import {Divider, message, Modal} from "antd"
import {useTranslation} from "react-i18next"
import {toggleThreadLike} from "../../data/thread"
import {format, isPast} from "date-fns"
import CommentList from "../Comment/CommentList"
import {AvatarSizes} from "../../constants/MediaSizes"
import StudentAvatar from "../Student/StudentAvatar"
import PostEditForm from "./Form/PostEditForm"
import {faPen, faLock, faHeart as faSolidHeart, faEllipsisH} from "@fortawesome/free-solid-svg-icons"
import {faTrashAlt, faHeart, faCommentAlt, faCommentDots} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { getWSService } from "../../realtime/services/WSService"
import WSPostsService from "../../realtime/services/WSPostsService"
import { formatDate } from "../../util"

type PostProps = {
    data: PostType
    isEdited: boolean
    embeded?: boolean
    forceShowComments?: boolean
    toggleEdition?: (toggle: boolean) => void
    onDelete?: (id: number) => Promise<void>
    onUpdate?: (id: number, postUpdate: PostType) => void
}

const Post: React.FC<PostProps> = ({ data, isEdited, embeded, forceShowComments, onDelete, onUpdate, toggleEdition }) => {
    const {t} = useTranslation(["common", "post"])
    const [liked, setLiked] = useState<boolean>(data.liked)
    const [likes, setLikes] = useState<number>(data.nbLikes)
    const [showComments, setShowComments] = useState<boolean>(!!(forceShowComments || (data.nbComments == 1 && data.trendingComment)))

    const [showEditMenu, setShowEditMenu] = useState<boolean>(false)

    const [noTrendingComment, setNoTrendingComment] = useState<boolean>(false)

    const [alreadyMore, setAlreadyMore] = useState<boolean>(false)

    const confirmDeletion = useCallback(() => {
        Modal.confirm({
            title: t("remove_item.title"),
            content: t("remove_item.content"),
            okText: "Ok",
            cancelText: t("cancel"),
            onOk: () => {
                onDelete?.(data.id).then(() => message.info(t("remove_item.complete")))
            }
        })
    }, [data.id, t, onDelete])

    const confirmUpdate = useCallback((updatedPost: PostType) => {
        message.info(t("update_item.complete")).then(() =>
            onUpdate?.(data.id, updatedPost)
        )
    }, [data.id, t, onUpdate])

    const toggleLike = useCallback(async (id: number) => {
        const res = await toggleThreadLike(id)
        if (res.status === 200) {
            setLiked(res.data)
            setLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1)
        }
    }, [])

    let post!: HTMLDivElement
    useEffect(() => {
        getWSService(WSPostsService).subscribe(data)

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
            getWSService(WSPostsService).unsubscribe(data)
        }
    }, [data.id])

    const [formattedDate, setFormattedDate] = useState<string>("")

    useEffect(() => {
        let timeoutId: number
        const updateDate = () => {
            const [date, wait] = formatDate(data.publicationDate, t)
            setFormattedDate(date)
            if(wait > 0)
                timeoutId = window.setTimeout(() => updateDate(), wait)
        }
        updateDate()
        return () => window.clearTimeout(timeoutId)
    }, [data.publicationDate])

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
                    onCancel={() => toggleEdition?.(false)}
                >
                    <PostEditForm post={data} onEdit={confirmUpdate} onClose={() => toggleEdition?.(false)}/>
                </Modal>
            )}
            <div className={"flex flex-col p-4 " + (embeded || "shadow-sm rounded-lg bg-white my-5")} ref={ele => { post = ele ?? post }}>
                <div className="w-full flex justify-between mb-1">
                    <div className="flex">
                        <StudentAvatar
                            id={data.author.id}
                            name={data.author.name}
                            picture={data.author.thumbnail}
                            pictureSize={AvatarSizes.THUMBNAIL}
                            showPreview
                            size={embeded ? "large" : "default"}
                        />
                        <div className={"items-center ml-2 " + (embeded && "ml-3")}>
                            <div className={"font-bold -mb-0.5 " + ((embeded && "text-base") || "-mt-0.5")}>{data.author.name}</div>
                            <div className={(embeded && "text-md") || "text-xs"}>{ formattedDate }</div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-end items-center text-lg -mt-4">
                        {!isPast(data.publicationDate) && (
                            <span className="mx-2 text-xs">
                                {format(new Date(data.publicationDate), "HH:mm  dd/MM/yy")}
                            </span>
                        )}
                        {data.hasWriteAccess && (
                            <div className="relative">
                                <div className="cursor-pointer group rounded-full hover:bg-indigo-700 hover:bg-opacity-10 transition-colors mr-3 md:mr-4 w-9 h-9 items-center flex justify-center"
                                    onClick={() => setShowEditMenu(!showEditMenu)}>
                                    <FontAwesomeIcon
                                        icon={faEllipsisH}
                                        className="text-gray-400 group-hover:text-indigo-400 transition-colors"
                                    />
                                </div>
                                {showEditMenu &&
                                    <div className="select-none edit-menu absolute top-10 right-4 rounded bg-white border-gray-300 border-opacity-70 border w-32 text-base font-medium z-20">
                                        <div onClick={confirmDeletion} className="flex items-center w-full text-red-600 px-3 py-2 cursor-pointer hover:bg-red-50 transition-colors">
                                            <FontAwesomeIcon
                                                icon={faTrashAlt}
                                                className="mr-2.5"
                                            /> Supprimer
                                        </div>
                                        {toggleEdition &&
                                            <div onClick={() => toggleEdition?.(true)} className="flex items-center w-full text-gray-500 px-3 py-2 cursor-pointer hover:bg-gray-100 hover:bg-opacity-80 transition-colors">
                                                <FontAwesomeIcon
                                                    icon={faPen}
                                                    className="mr-2.5"
                                                /> Modifier
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        )}
                        {data.private && <FontAwesomeIcon icon={faLock} className="text-gray-300 text-opacity-80"/>}
                    </div>
                </div>
                <div>
                    <label className={embeded ? "text-base" : ""}>{data.description}</label>
                    {data.embed && !embeded && <div className="mt-2"><Embed embed={data.embed} post={data}/></div>}
                </div>
                <div className="flex flex-row text-gray-600 justify-between mt-1 -mb-2.5">
                    <div className="items-center text-gray-400 grid grid-cols-2 w-full mr-5 text-center">
                        <span className="group flex items-center justify-center cursor-pointer hover:text-indigo-500 mr-3 text-xl transition-colors duration-100"
                            onClick={() => setShowComments(!showComments)}>
                            
                            <div className="text-base mr-1.5 w-7 text-right">&nbsp;{data.nbComments > 0 && data.nbComments}</div>
                            
                            <div className="-ml-1 cursor-pointer rounded-full bg-indigo-700 bg-opacity-0 group-hover:bg-opacity-10 transition-colors duration-200 w-10 h-10 items-center flex justify-center">
                                <FontAwesomeIcon
                                    icon={faCommentAlt}
                                    size="1x"
                                />
                            </div>
                        </span>
                        <span className="group flex items-center justify-center cursor-pointer mr-3 text-xl"
                            onClick={() => toggleLike(data.thread)}>
                            
                            <div className="text-base mr-1.5 w-7 text-right">&nbsp;{likes > 0 && likes}</div>
                            
                            <div className="-ml-1 cursor-pointer rounded-full bg-red-700 bg-opacity-0 group-hover:bg-opacity-10 transition-colors duration-200 w-10 h-10 items-center flex justify-center">
                                <FontAwesomeIcon
                                    icon={liked ? faSolidHeart: faHeart}
                                    className={`${liked ? "text-red-400" : "hover:text-red-600"} transition-colors`}
                                    size="1x"
                                />
                            </div>
                        </span>
                    </div>
                </div>
                {((data.trendingComment && !noTrendingComment) || showComments) && (
                    <>
                        <Divider className="mb-0 mt-4" />
                        <CommentList
                            showMoreComments={() => setShowComments(true)}
                            showComments={showComments}
                            trendingComment={noTrendingComment ? undefined : data.trendingComment}
                            numberComments={data.nbComments}
                            id={data.thread}
                            depth={0}
                            loadComment={data.nbComments !== 0} />
                    </>
                )}
            </div>
        </div>
    )
}

export default Post
