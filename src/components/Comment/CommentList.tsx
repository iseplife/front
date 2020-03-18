import React, {useEffect, useState} from "react";
import {Comment as CommentType} from "../../data/thread/types";
import Comment from "./index";
import {getComment} from "../../data/thread";


interface CommentListProps {
    id: number
    depth: number
}

const CommentList: React.FC<CommentListProps> = ({id}) => {
    const [comments, setComments] = useState<CommentType[]>([]);

    useEffect(() => {
        getComment(id).then(r => {
            if(r.data){
                setComments(r.data);
            }
        })
    });

    return (
        <div>
            {comments.map(c =>
                <Comment key={c.id} data={c} />
            )}
        </div>
    );
};

export default CommentList;