import React, {useCallback, useState} from "react";
import {Comment as CommentType} from "../../data/thread/types";
import {Avatar, Icon} from "antd";
import {toggleThreadLike} from "../../data/thread";


interface CommentProps {
    data: CommentType
}

const Comment: React.FC<CommentProps> = ({data}) => {
    const [liked, setLiked] = useState<boolean>(data.liked);
    const [likes, setLikes] = useState<number>(data.likes);

    const toggleLike = useCallback(async (id: number) => {
        const res = await toggleThreadLike(id);
        setLiked(res.data);
        setLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1);
    }, []);

    return (
        <div>
            <div className="flex flex-col">

                <Avatar icon="user" src={data.author.thumbnail}/>
                <div>
                    {data.message}
                </div>
                <div className="flex">
                    <span className="flex items-center cursor-pointer hover:text-indigo-400 mr-3">
                            {likes}
                        <Icon type="heart" className="ml-1" onClick={() => toggleLike(data.thread)}
                              theme={liked ? "filled" : "outlined"}
                        />
                    </span>
                    <span> { data.comments } commentaires</span>
                </div>
            </div>
            <div></div>
        </div>
    );
};

export default Comment;