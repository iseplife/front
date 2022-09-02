import React, {useCallback, useEffect, useState} from "react"
import {Comment as CommentType} from "../../data/thread/types"
import {reportComment, toggleThreadLike} from "../../data/thread"
import CommentList from "./CommentList"
import {useTranslation} from "react-i18next"
import {AvatarSizes} from "../../constants/MediaSizes"
import StudentAvatar from "../Student/StudentAvatar"
import {formatDateWithTimer} from "../../util"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCircleNotch, faFlag, faHeart as faSolidHeart, faPen, faSave, faUndo} from "@fortawesome/free-solid-svg-icons"
import {faHeart, faTrashAlt} from "@fortawesome/free-regular-svg-icons"
import TextArea from "antd/lib/input/TextArea"
import { Link } from "react-router-dom"
import { cFaPreviousArrow } from "../../constants/CustomFontAwesome"
import CustomText from "../Common/CustomText"
import { message } from "antd"


interface CommentProps {
    data: CommentType
    allowReplies: boolean
    handleDeletion: (id: number) => Promise<void>
    handleEdit: (id: number, msg: string) => Promise<void>
    lightboxView?: boolean
}

const Comment: React.FC<CommentProps> = ({data, allowReplies, handleDeletion, handleEdit, lightboxView}) => {
    const {t} = useTranslation(["common", "post"])
    const [liked, setLiked] = useState<boolean>(data.liked)
    const [editMode, setEditMode] = useState<boolean>(false)
    const [showComments, setShowComments] = useState<boolean>(false)
    const [likes, setLikes] = useState<number>(data.likes)
    const [formattedDate, setFormattedDate] = useState<string>("")
    const [editedMessage, setEditedMessage] = useState<string>(data.message)
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [isDeleting, setDeleting] = useState<boolean>(false)

    const [respond, setRespond] = useState<boolean>(false)

    useEffect(() => formatDateWithTimer(data.creation, t, setFormattedDate), [data.creation])

    const onUpdate = useCallback(() => {
        if(!isSubmitting) {
            setSubmitting(true)
            handleEdit(data.id, editedMessage).then(() => {
                setEditMode(false)
            }).finally(() => setSubmitting(false))
        }
    }, [handleEdit, data.id, editedMessage])

    const onDelete = useCallback(() => {
        if(!isDeleting) {
            setDeleting(true)
            handleDeletion(data.id)
                .finally(() => setDeleting(false))
        }
    }, [handleDeletion, data.id])

    const toggleLike = useCallback(async () => {
        const res = await toggleThreadLike(data.thread)
        if (res.status === 200) {
            setLiked(res.data)
            setLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1)
        }
    }, [data.thread])

    const onReport = useCallback(() => {
        reportComment(data.id)
        message.success(t("post:reported"))
    }, [data.id])

    return (
        <div className="flex my-1">
            <Link to={`/${data.author.authorType.toLowerCase()}/${data.author.id}`} className="mr-2">
                <StudentAvatar
                    id={data.author.id}
                    name={data.author.name}
                    picture={data.author.thumbnail}
                    pictureSize={AvatarSizes.THUMBNAIL}
                    size="small"
                />
            </Link>
            <div className="w-full">
                <div className={`flex flex-col justify-between rounded-lg px-2 py-1 ${lightboxView ? "bg-gray-100/20 text-neutral-100 md:text-black md:bg-gray-100" : "bg-gray-100"}`}>
                    <div className="items-center flex">
                        <Link to={`/${data.author.authorType.toLowerCase()}/${data.author.id}`} className={`${lightboxView ? "text-neutral-100 md:text-black" : "text-black" } text-xs flex-1 mr-3 font-bold hover:underline`}>{data.author.name}</Link>
                        {data.hasWriteAccess && (
                            <div className="flex items-center justify-end pt-1">
                                {editMode ?
                                    <>
                                        <FontAwesomeIcon
                                            icon={faUndo}
                                            className="mr-3 cursor-pointer text-gray-400 hover:text-red-400"
                                            onClick={() => {
                                                setEditMode(false)
                                                setEditedMessage(data.message)
                                            }}
                                        />
                                        <FontAwesomeIcon
                                            icon={isSubmitting ? faCircleNotch : faSave}
                                            spin={isSubmitting}
                                            className="cursor-pointer text-gray-500 hover:text-green-400"
                                            onClick={onUpdate}
                                        />
                                    </> :
                                    <>
                                        <FontAwesomeIcon
                                            icon={faPen}
                                            className="mr-3 text-gray-400 cursor-pointer hover:text-indigo-400"
                                            onClick={() => setEditMode(true)}
                                        />
                                        <FontAwesomeIcon
                                            icon={isDeleting ? faCircleNotch : faTrashAlt}
                                            spin={isDeleting}
                                            className="text-gray-400 cursor-pointer hover:text-red-600"
                                            onClick={onDelete}
                                        />
                                    </>
                                }
                                <FontAwesomeIcon
                                    icon={faFlag}
                                    spin={isSubmitting}
                                    className="ml-3 cursor-pointer text-gray-400 hover:text-red-400"
                                    onClick={onReport}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 my-1 break-words">
                        {editMode ?
                            <TextArea
                                autoFocus
                                rows={1}
                                value={editedMessage}
                                className="bg-transparent border-none focus"
                                onChange={(e) => setEditedMessage(e.target.value)}
                            /> : <CustomText description={data.message} disableSpacers />
                        }
                    </div>

                </div>
                <div className="flex items-center text-gray-400 mt-0.5">
                    <span className="flex items-center cursor-pointer ml-0.5 mr-2.5">
                        {likes > 0 && likes}
                        <FontAwesomeIcon
                            icon={liked ? faSolidHeart : faHeart}
                            className={`${liked ? "text-red-400" : "hover:text-red-600"} ml-1`}
                            onClick={toggleLike}
                            size="sm"
                        />
                    </span>
                    {allowReplies && (
                        <label
                            className={`mx-2 font-semibold hover:underline cursor-pointer ${lightboxView ? "text-gray-300 md:text-gray-500" : "text-gray-500"}`}
                            onClick={() => {
                                setShowComments(true)
                                setRespond(true)
                            }}
                        >
                            {t("post:respond")}
                        </label>
                    )}
                    ·<label className="ml-2">{formattedDate}</label>
                </div>
                <div className="flex">
                    {showComments ?
                        //TODO faire passer le panneau de droite au dessus lors du passage en lg ou xl (qd ça commence à wrap des noms de groupe / prénom-nom)
                        <>
                            <div className={`${lightboxView ? "bg-gray-400 md:bg-gray-200" : "bg-gray-200"} ml-2.5 -mr-1 sm:ml-5 my-4 w-0.5`} />
                            <CommentList
                                id={data.thread}
                                depth={1}
                                loadComment={data.comments !== 0}
                                showInput={respond}
                                className="flex-1"
                                bottomInput={true}
                                autofocusInput={true}
                                lightboxView={lightboxView}
                            />
                        </> :
                        (data.comments > 0 && (
                            <div
                                className="ml-2 mt-1 flex group cursor-pointer"
                                onClick={() => setShowComments(true)}
                            >
                                <label
                                    className={`-mt-0.5 ${lightboxView ? "text-gray-400" : "text-gray-500"} font-semibold group-hover:underline pointer-events-none`}
                                >
                                    <FontAwesomeIcon icon={cFaPreviousArrow} className="mr-2 rotate-180 text-base" />
                                    {`${data.comments} ${t("post:response")}${data.comments > 1 ? "s" : ""}`}
                                </label>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default Comment
