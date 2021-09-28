import React, {useCallback, useEffect, useMemo, useState} from "react"
import {Comment as CommentType} from "../../data/thread/types"
import {toggleThreadLike} from "../../data/thread"
import CommentList from "./CommentList"
import EditComment from "./EditComment"
import {useTranslation} from "react-i18next"
import {AvatarSizes} from "../../constants/MediaSizes"
import StudentAvatar from "../Student/StudentAvatar"
import {formatDate} from "../../util"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHeart as faSolidHeart, faPen} from "@fortawesome/free-solid-svg-icons"
import {faHeart, faTrashAlt} from "@fortawesome/free-regular-svg-icons"


interface CommentProps {
    data: CommentType
    allowReplies: boolean
    handleDeletion: (id: number) => Promise<void>
    handleEdit: (id: number, msg: string) => Promise<void>
}

const Comment: React.FC<CommentProps> = ({data, allowReplies, handleDeletion, handleEdit}) => {
    const {t} = useTranslation(["common", "post"])
    const [liked, setLiked] = useState<boolean>(data.liked)
    const [editMode, setEditMode] = useState<boolean>(false)
    const [showComments, setShowComments] = useState<boolean>(false)
    const [likes, setLikes] = useState<number>(data.likes)
    const [formattedDate, setFormattedDate] = useState<string>("")

    const [respond, setRespond] = useState<boolean>(false)

    useEffect(() => {
        let timeoutId: number
        const updateDate = () => {
            const [date, wait] = formatDate(data.creation, t)
            setFormattedDate(date)
            if(wait > 0)
                timeoutId = window.setTimeout(() => updateDate(), wait)
        }
        updateDate()
        return () => window.clearTimeout(timeoutId)
    }, [data.creation])

    const toggleLike = useCallback(async (id: number) => {
        const res = await toggleThreadLike(id)
        if (res.status === 200) {
            setLiked(res.data)
            setLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1)
        }
    }, [])

    return (
        <div className="flex my-1">
            <div className="mr-2">
                <StudentAvatar
                    id={data.author.id}
                    name={data.author.name}
                    picture={data.author.thumbnail}
                    pictureSize={AvatarSizes.THUMBNAIL}
                    size="small"
                />
            </div>
            <div>
                <div className="flex flex-col justify-between bg-gray-100 rounded-lg px-2 py-1">
                    <div className="items-center flex">
                        <span className="text-xs flex-1 mr-3 font-bold">{data.author.name}</span>
                        {data.hasWriteAccess && (
                            <div className="flex items-center justify-end">
                                <FontAwesomeIcon
                                    icon={faPen}
                                    className="mr-3 text-gray-400 cursor-pointer hover:text-indigo-400"
                                    onClick={() => setEditMode(true)}
                                />
                                <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    className="text-gray-400 cursor-pointer hover:text-red-600"
                                    onClick={() => handleDeletion(data.id)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 mt-0">
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
                <div className="flex items-center text-gray-400 mt-0.5">
                    <span className="flex items-center cursor-pointer ml-0.5 mr-2.5">
                        {likes > 0 && likes}
                        <FontAwesomeIcon
                            icon={liked ? faSolidHeart: faHeart}
                            className={`${liked ? "text-red-400" : "hover:text-red-600"} ml-1`}
                            onClick={() => toggleLike(data.thread)}
                            size="sm"
                        />
                    </span>
                    {allowReplies &&
                        <>
                        ·<label className="mx-2 font-semibold hover:underline cursor-pointer text-gray-500" onClick={() => {setShowComments(true); setRespond(true)}}>{t("post:respond")}</label>
                        </>
                    }
                    ·<label className="ml-2">{formattedDate}</label>
                </div>
                <div className="flex">
                    {showComments &&
                        //TODO faire passer le panneau de droite au dessus lors du passage en lg ou xl (qd ça commence à wrap des noms de groupe / prénom-nom)
                        <>
                            <div className="border border-1 border-gray-200 ml-5 my-4"/>
                            <CommentList id={data.thread} depth={1} loadComment={data.comments !== 0} showInput={respond} className="flex-1" bottomInput={true} autofocusInput={true} />
                        </>
                    || (!!data.comments &&
                        <div className="ml-2 mt-1 flex group cursor-pointer"
                            onClick={() => setShowComments(true)}>
                            <img src="/img/icons/following-arrow.svg" className="w-4 h-4 mr-2" />
                            <label className="-mt-0.5 font-semibold group-hover:underline pointer-events-none">
                                {`${data.comments} ${t("post:response")}${data.comments > 1 ? "s" : ""}`}
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Comment
