import React, {useCallback, useState} from "react";
import {Comment as CommentType} from "../../data/thread/types";
import {Avatar, Icon} from "antd";
import {toggleThreadLike} from "../../data/thread";
import CommentList from "./CommentList";
import EditComment from "./EditComment";


interface CommentProps {
    data: CommentType
    allowReplies: boolean
    handleDeletion: (id: number) => Promise<void>
    handleEdit: (id: number, msg: string) => Promise<void>
}

const Comment: React.FC<CommentProps> = ({data, allowReplies, handleDeletion, handleEdit}) => {
    const [liked, setLiked] = useState<boolean>(data.liked);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [showComments, setShowComments] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(data.likes);


    const toggleLike = useCallback(async (id: number) => {
        const res = await toggleThreadLike(id);
        if (res.status === 200) {
            setLiked(res.data);
            setLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1);
        }
    }, []);

    return (
        <div className="flex flex-col my-3">
            <div className="flex flex-col justify-between bg-gray-100 rounded p-2">
                <div className="flex justify-between">
                    <Avatar icon="user" src={data.author.thumbnail} size="small" className="mr-3"/>
                    {data.hasWriteAccess &&
                    <div className="flex items-center">
                        <Icon type="edit"
                              className="mr-3 cursor-pointer hover:text-indigo-400"
                              onClick={() => setEditMode(true)}
                        />
                        <Icon type="delete"
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
                            uploadEdit={(msg: string) => handleEdit(data.id, msg)}
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
                    <Icon type="heart" className="ml-1" theme={liked ? "filled" : "outlined"}
                          onClick={() => toggleLike(data.thread)}/>
                </span>
                {allowReplies &&
                <span className="flex items-center cursor-pointer hover:text-indigo-400">
                        {data.comments !== 0 && data.comments}
                    <Icon type="message" className="ml-1" onClick={() => setShowComments(true)}/>
                </span>
                }
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
    );
};

export default Comment;