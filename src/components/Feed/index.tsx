import React, {CSSProperties, useCallback, useEffect, useState} from "react";
import {Post as PostType} from "../../data/post/types";
import {getFeedPost} from "../../data/feed";
import InfiniteScroller, {loaderCallback} from "../Common/InfiniteScroller";
import Post from "../Post";
import {IconFA} from "../Common/IconFA";
import PostForm from "./PostForm";
import {Divider} from "antd/es";

type FeedProps = {
    name: string
    allowPublication?: boolean
    style?: CSSProperties,
    className?: string,
}

const Feed: React.FC<FeedProps> = ({name, allowPublication, style, className}) => {
    const [posts, setPosts] = useState<PostType[]>([]);
    const loadMorePost: loaderCallback = useCallback(async (count: number) => {
        const res = await getFeedPost(name, count);
        setPosts(posts => [...posts, ...res.data.content]);

        return res.data.last;
    }, [name]);

    return (
        <div className={`${className} max-w-4xl`} style={style}>
            <Divider className="font-dinotcb text-gray-500 text-lg" orientation="left">Publications</Divider>
            {allowPublication && (
                <PostForm />
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