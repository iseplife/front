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
import {faPen, faLock, faComment, faHeart as faSolidHeart} from "@fortawesome/free-solid-svg-icons"
import {faTrashAlt, faHeart} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { getWSService } from "../../realtime/services/WSService"
import WSPostsService from "../../realtime/services/WSPostsService"

type PostProps = {
    data: PostType
    isEdited: boolean
    toggleEdition: (toggle: boolean) => void
    onDelete: (id: number) => Promise<void>
    onUpdate: (id: number, postUpdate: PostType) => void
}

const Post: React.FC<PostProps> = ({data, isEdited, onDelete, onUpdate, toggleEdition}) => {
    const {t} = useTranslation(["common", "post"])
    const [liked, setLiked] = useState<boolean>(data.liked)
    const [likes, setLikes] = useState<number>(data.nbLikes)
    const [showComments, setShowComments] = useState<boolean>(false)
    const confirmDeletion = useCallback(() => {
        Modal.confirm({
            title: t("remove_item.title"),
            content: t("remove_item.content"),
            okText: "Ok",
            cancelText: t("cancel"),
            onOk: () => {

                onDelete(data.id).then(() => message.info(t("remove_item.complete")))
            }
        })
    }, [data.id, t, onDelete])

    const confirmUpdate = useCallback((updatedPost: PostType) => {
        message.info(t("update_item.complete")).then(() =>
            onUpdate(data.id, updatedPost)
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
            <div className="flex flex-col shadow rounded-lg bg-white my-5 p-4 max-w-4xl" ref={ele => { post = ele ?? post }}>
                <div className="flex flex-row justify-end items-center">
                    {!isPast(data.publicationDate) && (
                        <span className="mx-2 text-xs">
                            {format(new Date(data.publicationDate), "HH:mm  dd/MM/yy")}
                        </span>
                    )}
                    {data.hasWriteAccess && (
                        <>
                            <FontAwesomeIcon
                                icon={faPen}
                                className="mr-3 cursor-pointer text-gray-300 hover:text-indigo-400"
                                onClick={() => toggleEdition(true)}
                            />
                            <FontAwesomeIcon
                                icon={faTrashAlt}
                                className="mr-3 cursor-pointer text-gray-300 hover:text-red-600"
                                onClick={confirmDeletion}
                            />
                        </>
                    )}
                    {data.private && <FontAwesomeIcon icon={faLock} className="text-gray-300"/>}
                </div>
                <div>
                    <p>{data.description}</p>
                    {data.embed && <Embed embed={data.embed}/>}
                </div>
                <div className="flex flex-row text-gray-600 justify-between mt-2">
                    <StudentAvatar
                        id={data.author.id}
                        name={data.author.name}
                        picture={data.author.thumbnail}
                        pictureSize={AvatarSizes.THUMBNAIL}
                        showPreview
                    />
                    <div className="flex items-center text-gray-400">
                        <span className="flex items-center cursor-pointer hover:text-indigo-400 mr-3" onClick={() => setShowComments(!showComments)}>
                            {data.nbComments > 0 && data.nbComments}
                            <FontAwesomeIcon
                                icon={faComment}
                                className="ml-1"
                                size="sm"
                            />
                        </span>
                        <span className="flex items-center cursor-pointer mr-3">
                            {likes > 0 && likes}
                            <FontAwesomeIcon
                                icon={liked ? faSolidHeart: faHeart}
                                className={`${liked ? "text-red-400" : "hover:text-red-600"} ml-1`}
                                onClick={() => toggleLike(data.thread)}
                                size="sm"
                            />
                        </span>
                    </div>
                </div>
                {showComments && (
                    <>
                        <Divider/>
                        <CommentList id={data.thread} depth={0} loadComment={data.nbComments !== 0}/>
                    </>
                )}
            </div>
        </div>
    )
}

export default Post
