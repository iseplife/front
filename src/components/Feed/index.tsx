import React, {CSSProperties, useCallback, useEffect, useState} from "react";
import {Post as PostType, PostCreation} from "../../data/post/types";
import {getFeedPost} from "../../data/feed";
import InfiniteScroller, {loaderCallback} from "../Common/InfiniteScroller";
import Post from "../Post";
import PostForm from "./PostForm";
import {Divider} from "antd";
import {createPost} from "../../data/post";

type FeedProps = {
    id: number
    allowPublication?: boolean
    style?: CSSProperties,
    className?: string,
}

const Feed: React.FC<FeedProps> = ({id, allowPublication, style, className}) => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const loadMorePost: loaderCallback = useCallback(async (count: number) => {
        const res = await getFeedPost(id, count);
        setPosts(posts => [...posts, ...res.data.content]);

        return res.data.last;
    }, [id]);

    const sendPost = async (post: PostCreation)=> {
        console.log("oui");
        const res = await createPost(post);
        if(res.status === 200){
            setPosts(prevPosts => [res.data, ...prevPosts]);
        }
    };

    return (
        <div className={`${className} max-w-4xl`} style={style}>
            <Divider className="font-dinotcb text-gray-500 text-lg" orientation="left">Publications</Divider>
            {allowPublication && (
                <PostForm feedId={id} sendPost={sendPost}/>
            )}

            <InfiniteScroller watch="DOWN" callback={loadMorePost}>
                {posts.map((p, i) => (
                    <Post key={i} data={p}/>
                ))}
            </InfiniteScroller>
        </div>
    );
};

Feed.defaultProps = {
    allowPublication: true,
    className: "",
};

export default Feed;