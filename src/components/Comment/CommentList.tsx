import React, {useCallback, useEffect, useState} from "react";
import {Comment as CommentType} from "../../data/thread/types";
import Comment from "./index";
import {commentThread, getThreadComments} from "../../data/thread";
import Loading from "../Common/Loading";
import CommentForm from "./CommentForm";

interface CommentListProps {
    id: number
    depth: number
    loadComment?: boolean
    className?: string
}

const CommentList: React.FC<CommentListProps> = ({id, depth, loadComment = true, className}) => {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState<boolean>(loadComment);
    const [error, setError] = useState<string>();

    const sendComment = useCallback(async (message: string) => {
        const res = await commentThread(id, message);
        if (res.status === 200) {
            setComments(comments => [...comments, res.data])
        }
    }, [id]);

    useEffect(() => {
        if (loadComment) {
            getThreadComments(id).then(r => {
                if (r.data) {
                    setComments(r.data);
                    setLoading(false)
                }
            })
        }
    }, [id, loadComment]);

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
                    <Comment key={c.id} data={c} allowReplies={depth === 0}/>
                )}
            </div>
        );
    }
};

export default CommentList;