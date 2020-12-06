import React, {useCallback, useEffect, useState} from "react"
import {Comment as CommentType, CommentForm as CommentFormType} from "../../data/thread/types"
import Comment from "./index"
import {commentThread, deleteThreadComment, editThreadComment, getThreadComments} from "../../data/thread"
import Loading from "../Common/Loading"
import CommentForm from "./CommentForm"

interface CommentListProps {
    id: number
    depth: number
    loadComment?: boolean
    className?: string
}

const CommentList: React.FC<CommentListProps> = ({id, depth, loadComment = true, className}) => {
    const [comments, setComments] = useState<CommentType[]>([])
    const [loading, setLoading] = useState<boolean>(loadComment)
    const [error, setError] = useState<string>()

    const sendComment = useCallback(async (comment: CommentFormType) => {
        const res = await commentThread(id, comment)
        if (res.status === 200) {
            setComments(comments => [...comments, res.data])
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
            setComments(comments => comments.map(c => c.id !== comID ? c: res.data))
        }
    }, [id])

    useEffect(() => {
        if (loadComment) {
            getThreadComments(id).then(r => {
                if (r.data) {
                    setComments(r.data)
                    setLoading(false)
                }
            })
        }
    }, [id, loadComment])

    if (loading) {
        return (
            <div className="flex-1">
                <Loading size="sm"/>
            </div>
        )
    } else {
        if (error) {
            return (<div> {error} :( </div>)
        }
        return (
            <div className={`ml-4 ${className}`}>
                <CommentForm handleUpload={sendComment}/>
                {comments.map(c =>
                    <Comment
                        key={c.id}
                        data={c}
                        allowReplies={depth === 0}
                        handleDeletion={deleteComment}
                        handleEdit={editComment}
                    />
                )}
            </div>
        )
    }
}

export default CommentList