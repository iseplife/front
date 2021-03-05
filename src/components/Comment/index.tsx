import React, {useCallback, useMemo, useState} from "react"
import {Comment as CommentType} from "../../data/thread/types"
import {Avatar} from "antd"
import {toggleThreadLike} from "../../data/thread"
import CommentList from "./CommentList"
import EditComment from "./EditComment"
import {useTranslation} from "react-i18next"
import {format, isToday} from "date-fns"
import {
    EditOutlined,
    DeleteOutlined,
    MessageOutlined,
    UserOutlined,
    HeartOutlined,
    HeartFilled
} from "@ant-design/icons"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"


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

    const publicationDate = useMemo((): string => {
        let lastDate
        let dateString = ""
        if (data.lastEdition) {
            lastDate = new Date(data.lastEdition)
            dateString = t("edited_last_at")
        } else {
            lastDate = new Date(data.creation)
        }

        return dateString + (isToday(lastDate) ?
            format(lastDate, "HH:mm") :
            format(lastDate, "HH:mm dd/MM/yy"))
    }, [data.creation, data.lastEdition])

    const toggleLike = useCallback(async (id: number) => {
        const res = await toggleThreadLike(id)
        if (res.status === 200) {
            setLiked(res.data)
            setLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1)
        }
    }, [])

    return (
        <div className="flex flex-col my-3">
            <div className="flex flex-col justify-between bg-gray-100 rounded p-2">
                <div className="flex justify-between items-center">
                    <Avatar
                        icon={<UserOutlined/>}
                        src={mediaPath(data.author.thumbnail, AvatarSizes.THUMBNAIL)}
                        size="small"
                        className="mr-3"
                    />
                    <span className="text-xs flex-1 text-right mr-3">{publicationDate}</span>
                    {data.hasWriteAccess &&
                    <div className="flex items-center">
                        <EditOutlined
                            className="mr-3 cursor-pointer hover:text-indigo-400"
                            onClick={() => setEditMode(true)}
                        />
                        <DeleteOutlined
                            className="mr-3 cursor-pointer hover:text-red-600"
                            onClick={() => handleDeletion(data.id)}
                        />
                    </div>
                    }
                </div>

                <div className="flex-1 mt-3">
                    {editMode ?
                        <EditComment
                            value={data.message}
                            uploadEdit={msg => handleEdit(data.id, msg)}
                            disableEditMode={() => setEditMode(false)}
                        />
                        :
                        <>{data.message}</>
                    }
                </div>

            </div>
            <div className="flex items-center text-gray-500">
                <span className="flex items-center cursor-pointer hover:text-indigo-400 mr-2">
                    {likes !== 0 && likes}
                    {liked ?
                        <HeartFilled className="ml-1" onClick={() => toggleLike(data.thread)}/> :
                        <HeartOutlined className="ml-1" onClick={() => toggleLike(data.thread)}/>
                    }
                </span>
                {allowReplies && (
                    <span className="flex items-center cursor-pointer hover:text-indigo-400">
                        {data.comments !== 0 && data.comments}
                        <MessageOutlined className="ml-1" onClick={() => setShowComments(!showComments)}/>
                    </span>
                )}
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