import React, {useCallback, useMemo, useState} from "react"
import {Comment as CommentType} from "../../data/thread/types"
import {toggleThreadLike} from "../../data/thread"
import CommentList from "./CommentList"
import EditComment from "./EditComment"
import {useTranslation} from "react-i18next"
import {AvatarSizes} from "../../constants/MediaSizes"
import StudentAvatar from "../Student/StudentAvatar"
import {IconFA} from "../Common/IconFA"
import {_formatDistance} from "../../util"


interface CommentProps {
    data: CommentType
    allowReplies: boolean
    handleDeletion: (id: number) => Promise<void>
    handleEdit: (id: number, msg: string) => Promise<void>
}

const Comment: React.FC<CommentProps> = ({data, allowReplies, handleDeletion, handleEdit}) => {
    const {t} = useTranslation()
    const [liked, setLiked] = useState<boolean>(data.liked)
    const [editMode, setEditMode] = useState<boolean>(false)
    const [showComments, setShowComments] = useState<boolean>(false)
    const [likes, setLikes] = useState<number>(data.likes)

    const publicationDate = useMemo((): string => (
        data.lastEdition ?
            t("edited_last_at") + _formatDistance(data.lastEdition, new Date(), { addSuffix: true }):
            _formatDistance(data.creation, new Date(), { addSuffix: true })
    ), [data.creation, data.lastEdition])

    const toggleLike = useCallback(async (id: number) => {
        const res = await toggleThreadLike(id)
        if (res.status === 200) {
            setLiked(res.data)
            setLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1)
        }
    }, [])

    return (
        <div className="flex flex-col my-3">
            <div className="flex flex-col justify-between bg-gray-100 rounded-lg p-2">
                <div className="flex justify-between items-center">
                    <StudentAvatar
                        id={data.author.id}
                        name={data.author.name}
                        picture={data.author.thumbnail}
                        pictureSize={AvatarSizes.THUMBNAIL}
                        size="small"
                        className="mr-3"
                        showPreview
                    />
                    <span className="text-xs flex-1 text-right mr-3 text-gray-400">{publicationDate}</span>
                    {data.hasWriteAccess && (
                        <div className="flex items-center">
                            <IconFA
                                name="fa-pen"
                                className="mr-3 text-gray-400 cursor-pointer hover:text-indigo-400"
                                onClick={() => setEditMode(true)}
                            />
                            <IconFA
                                name="fa-trash-alt"
                                type="regular"
                                className="mr-3 text-gray-400 cursor-pointer hover:text-red-600"
                                onClick={() => handleDeletion(data.id)}
                            />
                        </div>
                    )}
                </div>

                <div className="flex-1 mt-3">
                    {editMode ?
                        <EditComment
                            value={data.message}
                            uploadEdit={msg => handleEdit(data.id, msg)}
                            disableEditMode={() => setEditMode(false)}
                        /> :
                        <>{data.message}</>
                    }
                </div>

            </div>
            <div className="flex items-center text-gray-400 mt-1">
                {allowReplies && (
                    <span className="flex items-center cursor-pointer hover:text-indigo-400 mx-1" onClick={() => setShowComments(!showComments)}>
                        {data.comments !== 0 && data.comments}
                        <IconFA
                            name="fa-comment"
                            size="sm"
                            type="regular"
                            className="ml-1"
                            onClick={() => setShowComments(!showComments)}
                        />
                    </span>
                )}
                <span className="flex items-center cursor-pointer mx-1">
                    {likes > 0 && likes}
                    <IconFA
                        name="fa-heart" type={liked ? "solid" : "regular"}
                        size="sm"
                        className={`${liked ? "text-red-400" : "hover:text-red-600"} ml-1`}
                        onClick={() => toggleLike(data.thread)}
                    />
                </span>
            </div>

            <div className="flex ">
                {showComments &&
                <>
                    <div className="border border-1 border-gray-200 ml-5 my-4"/>
                    <CommentList id={data.thread} depth={1} loadComment={data.comments !== 0} className="flex-1"/>
                </>
                }
            </div>

        </div>
    )
}

export default Comment