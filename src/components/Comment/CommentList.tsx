import React, {useCallback, useEffect, useState} from "react"
import {Comment as CommentType, CommentForm as CommentFormType} from "../../data/thread/types"
import Comment from "./index"
import {commentThread, deleteThreadComment, editThreadComment, getThreadComments} from "../../data/thread"
import Loading from "../Common/Loading"
import CommentForm from "./CommentForm"
import {useTranslation} from "react-i18next"

interface CommentListProps {
    id: number
    depth: number
    showComments?: boolean
    showMoreComments?: () => void
    trendingComment?: CommentType
    numberComments?: number
    loadComment?: boolean
    showInput?: boolean
    bottomInput?: boolean
    autofocusInput?: boolean
    showOne?: boolean
    className?: string
    lightbox?: boolean
}

const CommentList: React.FC<CommentListProps> = ({ id, depth, showComments = true, showMoreComments, trendingComment, numberComments = 0, loadComment = true, showInput = true, bottomInput, autofocusInput, showOne, className, lightbox}) => {
    const [comments, setComments] = useState<CommentType[]>([])
    const [loading, setLoading] = useState<boolean>(loadComment && showComments)
    const [t] = useTranslation(["post"])

    useEffect(() => {
        setLoading(loadComment && showComments)
    }, [showComments])

    const sendComment = useCallback(async (comment: CommentFormType) => {
        const res = await commentThread(id, comment)
        if (res.status === 200) {
            setComments(comments => [...comments,
                {
                    ...res.data,
                    creation: new Date(),
                    likes: 0,
                    comments: 0,
                    liked: false,
                    hasWriteAccess: true
                }
            ])
        }
    }, [id])

    const deleteComment = useCallback(async (comID: number) => {
        const res = await deleteThreadComment(id, comID)
        if (res.status === 200) {
            setComments(comments => comments.filter(c => c.id !== comID))
        }
    }, [id])

    const editComment = useCallback(async (comID: number, msg: string) => {
        const res = await editThreadComment(id, comID, msg)
        if (res.status === 200) {
            setComments(comments => comments.map(c => c.id !== comID ?
                c : {...c, ...res.data}
            ))
        }
    }, [id])

    useEffect(() => {
        if (loadComment && showComments)
            if (numberComments == 1 && trendingComment)
                setLoading(false)
            else
                getThreadComments(id).then(r => {
                    if (r.data) {
                        if (trendingComment)
                            r.data = r.data.filter(comm => comm.id != trendingComment.id)

                        setComments(r.data)
                        setLoading(false)
                    }
                })
    }, [id, loadComment, showComments])

    return loading && !trendingComment ?
        <div className="flex-1">
            <Loading size="sm"/>
        </div> :
        <div className={`ml-4 ${className}`}>
            {showInput && !bottomInput &&
            <CommentForm handleUpload={sendComment} focus={autofocusInput && showInput}/>}
            {trendingComment && (
                <>
                    <Comment
                        key={trendingComment.id}
                        data={trendingComment}
                        allowReplies={depth === 0}
                        handleDeletion={deleteComment}
                        handleEdit={editComment}
                    />

                    {!showComments && numberComments > 1 && (
                        <div
                            className="font-semibold text-black text-opacity-70 cursor-pointer hover:underline"
                            onClick={showMoreComments}
                        >
                            {t("post:see_more_comments")}
                        </div>
                    )}
                </>
            )}
            {loading && <div className="flex-1"> <Loading size="sm"/> </div>}
            {comments.map(c =>
                <Comment
                    lightbox={lightbox}
                    key={c.id}
                    data={c}
                    allowReplies={depth === 0}
                    handleDeletion={deleteComment}
                    handleEdit={editComment}
                />
            )}
            {showInput && bottomInput && (
                <CommentForm handleUpload={sendComment} focus={autofocusInput && showInput}/>
            )}
        </div>
}

export default CommentList