import React, {useCallback, useState} from "react"
import {Post as PostType, PostUpdate} from "../../data/post/types"
import Embed from "./Embed"
import {Divider, message, Modal} from "antd"
import {useTranslation} from "react-i18next"
import {toggleThreadLike} from "../../data/thread"
import {format, isPast} from "date-fns"
import CommentList from "../Comment/CommentList"
import {AvatarSizes} from "../../constants/MediaSizes"
import PostEditForm from "./PostEditForm"
import {IconFA} from "../Common/IconFA"
import StudentAvatar from "../Student/StudentAvatar"

type PostProps = {
    data: PostType
    editMode: boolean
    onDelete: (id: number) => Promise<void>
    onEdit: (id: number) => void
    onUpdate: (id: number, postUpdate: PostUpdate) => Promise<boolean>
}

const Post: React.FC<PostProps> = ({data, editMode, onDelete, onUpdate, onEdit}) => {
    const {t} = useTranslation()
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
    const confirmUpdate = useCallback((update: PostUpdate) => {
        Modal.confirm({
            title: t("update_item.title"),
            content: t("update_item.content"),
            okText: "Ok",
            cancelText: t("cancel"),
            onOk: () => {
                onUpdate(data.id, update).then(r => {
                    if (r) {
                        message.info(t("update_item.complete"))
                        onEdit(0)
                    }
                })
            }
        })
    }, [data.id, t, onUpdate, onEdit])

    const toggleLike = useCallback(async (id: number) => {
        const res = await toggleThreadLike(id)
        if (res.status === 200) {
            setLiked(res.data)
            setLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1)
        }
    }, [])


    return (
        <div className="flex flex-col shadow rounded-lg bg-white my-5 p-4 max-w-4xl">
            {editMode ?
                <PostEditForm
                    description={data.description}
                    isPrivate={data.private}
                    publicationDate={data.publicationDate}
                    onClose={() => onEdit(0)}
                    onUpdate={confirmUpdate}
                /> :
                <>
                    <div className="flex flex-row justify-end items-center">
                        {!isPast(data.publicationDate) &&
                        <span className="mx-2 text-xs">
                            {format(new Date(data.publicationDate), "HH:mm  dd/MM/yy")}
                        </span>
                        }
                        {data.hasWriteAccess && (
                            <>
                                <IconFA
                                    name="fa-pen"
                                    className="mr-3 cursor-pointer text-gray-300 hover:text-indigo-400"
                                    onClick={() => onEdit(data.id)}
                                />
                                <IconFA
                                    name="fa-trash-alt"
                                    type="regular"
                                    className="mr-3 cursor-pointer text-gray-300 hover:text-red-600"
                                    onClick={confirmDeletion}
                                />
                            </>
                        )}
                        {data.private && <IconFA name="fa-lock" className="text-gray-300"/>}
                    </div>
                    <div>
                        <p>
                            {data.description}
                        </p>
                        <Embed embed={data.embed}/>
                    </div>
                </>
            }
            <div className="flex flex-row text-gray-600 justify-between mt-2">
                <StudentAvatar
                    id={data.author.id}
                    name={data.author.name}
                    picture={data.author.thumbnail}
                    pictureSize={AvatarSizes.THUMBNAIL}
                    showPreview
                />
                <div className="flex items-center">
                    <span className="flex items-center cursor-pointer hover:text-indigo-400 mr-3" onClick={() => setShowComments(!showComments)}>
                        {data.nbComments > 0 && data.nbComments}
                        <IconFA
                            name="fa-comment"
                            size="sm"
                            type="regular"
                            className="ml-1"
                        />
                    </span>
                    <span className="flex items-center cursor-pointer hover:text-indigo-400 mr-3">
                        {likes > 0 && likes}
                        <IconFA
                            name="fa-heart" type={liked ? "solid" : "regular"}
                            size="sm"
                            className={`${liked ? "text-red-600":"hover:text-red-600"}`}
                            onClick={() => toggleLike(data.thread)}
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
    )
}

export default Post