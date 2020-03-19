import React, {useCallback, useState} from "react";
import {Comment as CommentType} from "../../data/thread/types";
import {Avatar, Divider, Icon} from "antd";
import {toggleThreadLike} from "../../data/thread";
import CommentList from "./CommentList";


interface CommentProps {
    data: CommentType
    allowReplies: boolean
}

const Comment: React.FC<CommentProps> = ({data, allowReplies}) => {
    const [liked, setLiked] = useState<boolean>(data.liked);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(data.likes);

    const toggleLike = useCallback(async (id: number) => {
        const res = await toggleThreadLike(id);
        if(res.status === 200){
            setLiked(res.data);
            setLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1);
        }
    }, []);

    return (
        <div className="flex flex-col my-3">
            <div className="flex justify-between bg-gray-100 rounded p-2">
                <Avatar icon="user" src={data.author.thumbnail} size="small" className="mr-3"/>
                <div className="flex-1">
                    {data.message}
                </div>
                <div className="flex flex-col items-end justify-end">
                    <span className="flex items-end cursor-pointer hover:text-indigo-400 mb-1">
                        {likes !== 0 && likes}
                        <Icon type="heart" className="ml-1" theme={liked ? "filled" : "outlined"} onClick={() => toggleLike(data.thread)}/>
                    </span>
                    { allowReplies &&
                        <span className="flex items-end cursor-pointer hover:text-indigo-400 mt-1">
                            { data.comments !== 0 && data.comments}
                            <Icon type="message" className="ml-1" onClick={() => setShowComments(true)}/>
                        </span>
                    }
                </div>
            </div>
            <div className="flex ">
                { showComments &&
                    <>
                        <div className="border border-1 border-gray-200 ml-5 my-4" />
                        <CommentList id={data.thread} depth={1} loadComment={data.comments !== 0} className="flex-1"/>
                    </>
                }
            </div>

        </div>
    );
};

export default Comment;