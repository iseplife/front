import React, {useCallback, useEffect, useMemo, useState} from "react"
import {Comment as CommentType, CommentForm as CommentFormType} from "../../data/thread/types"
import Comment from "./index"
import {commentThread, deleteThreadComment, editThreadComment, getThreadComments} from "../../data/thread"
import Loading from "../Common/Loading"
import CommentForm from "./CommentForm"
import {useTranslation} from "react-i18next"
import { useLiveQuery } from "dexie-react-hooks"
import { feedsManager } from "../../datamanager/FeedsManager"
import { differenceInMilliseconds } from "date-fns/esm"
import EasterEgg from "../EasterEgg/EasterEgg"

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
    lightboxView?: boolean
    orderOldFirst?: boolean
}

const CommentList: React.FC<CommentListProps> = ({ id, depth, showComments = true, showMoreComments: _showMoreComments, trendingComment, numberComments = 0, loadComment = true, showInput = true, bottomInput, autofocusInput, showOne, className, lightboxView, orderOldFirst}) => {
    const [comments, setComments] = useState<CommentType[]>([])
    const [loading, setLoading] = useState<boolean>(loadComment && showComments)
    const [t] = useTranslation(["post"])

    useEffect(() => {
        setLoading(loadComment && showComments)
    }, [showComments])

    const loadComments = useCallback(() => {
        getThreadComments(id).then(r => {
            if (r.data) {
                if (trendingComment)
                    r.data = r.data.filter(comm => comm.id != trendingComment.id)

                if(orderOldFirst)
                    r.data = r.data.sort((a, b) => differenceInMilliseconds(a.creation, b.creation))
                setComments(r.data)
                setLoading(false)
            }
        })
    }, [trendingComment, id, orderOldFirst])

    const showMoreComments = useCallback(() => {
        if (loadComment && showComments) {
            loadComments()
        } else
            _showMoreComments?.()
    }, [_showMoreComments, loadComment, showComments, loadComments])

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
                loadComments()
    }, [id, loadComment, showComments, loadComments])

    const loadedComments = useMemo(() => comments.length + (trendingComment ? 1 : 0), [comments.length, !!trendingComment])

    const blocked = useLiveQuery(() => feedsManager.getBlocked(), [])

    return loading && !trendingComment ?
        <div className="flex-1">
            <Loading size="sm"/>
        </div> :
        <div className={`ml-4 ${className}`}>
            {showInput && !bottomInput &&
            <CommentForm lightboxView={lightboxView} handleUpload={sendComment} focus={autofocusInput && showInput}/>}
            {trendingComment && !blocked?.includes(trendingComment.author.id) && (
                <>
                    <Comment
                        key={trendingComment.id}
                        data={trendingComment}
                        allowReplies={depth === 0}
                        handleDeletion={deleteComment}
                        handleEdit={editComment}
                        lightboxView={lightboxView}
                    />
                </>
            )}
            {loading && <div className="flex-1"> <Loading size="sm"/> </div>}
            {comments.map(c => !blocked?.includes(c.author.id) && 
                <Comment
                    lightboxView={lightboxView}
                    key={c.id}
                    data={c}
                    allowReplies={depth === 0}
                    handleDeletion={deleteComment}
                    handleEdit={editComment}
                />
            )}

            {((!showComments && numberComments > 1) || (!loading && numberComments > loadedComments)) && (
                <div
                    className="font-semibold text-black text-opacity-70 cursor-pointer hover:underline"
                    onClick={showMoreComments}
                >
                    {t("post:see_more_comments")}
                </div>
            )}

            {id!==233298 || numberComments !== comments.length+1?
                <></>
                :
                <EasterEgg id={21} name={"évidemment ODM"}></EasterEgg>
            }
            {showInput && bottomInput && (
                <CommentForm lightboxView={lightboxView} handleUpload={sendComment} focus={autofocusInput && showInput}/>
            )}
        </div>
}

export default CommentList
