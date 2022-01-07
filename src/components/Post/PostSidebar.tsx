import React, {useCallback, useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {Divider} from "antd"
import {toggleThreadLike} from "../../data/thread"
import {getWSService} from "../../realtime/services/WSService"
import WSPostsService from "../../realtime/services/WSPostsService"
import {formatDateWithTimer} from "../../util"
import StudentAvatar from "../Student/StudentAvatar"
import {AvatarSizes} from "../../constants/MediaSizes"
import {format, isFuture} from "date-fns"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHeart as faSolidHeart} from "@fortawesome/free-solid-svg-icons"
import {faCommentAlt, faHeart} from "@fortawesome/free-regular-svg-icons"
import CommentList from "../Comment/CommentList"
import {Post} from "../../data/post/types"

type PostSidebarProps = {
    post: Post
}
const PostSidebar: React.FC<PostSidebarProps> = ({post}) => {
    const {t} = useTranslation(["common", "post"])
    const [liked, setLiked] = useState<boolean>(post.liked)
    const [likes, setLikes] = useState<number>(post.nbLikes)
    const [noTrendingComment, setNoTrendingComment] = useState<boolean>(false)

    const toggleLike = useCallback(async (id: number) => {
        const res = await toggleThreadLike(id)
        if (res.status === 200) {
            setLiked(res.data)
            setLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1)
        }
    }, [])

    useEffect(() => {
        getWSService(WSPostsService).subscribe(post)

        return () => getWSService(WSPostsService).unsubscribe(post)
    }, [post.id])

    const [formattedDate, setFormattedDate] = useState<string>("")
    useEffect(() => formatDateWithTimer(post.publicationDate, t, setFormattedDate), [post.publicationDate])

    return (
        <div>
            <div className="flex flex-col p-4">
                <div className="w-full flex justify-between mb-1">
                    <div className="flex">
                        <StudentAvatar
                            id={post.author.id}
                            name={post.author.name}
                            picture={post.author.thumbnail}
                            pictureSize={AvatarSizes.THUMBNAIL}
                            showPreview
                            size="large"
                        />
                        <div className="items-center ml-3">
                            <div className="font-bold -mb-0.5 text-base">{post.author.name}</div>
                            <div className="text-md">{ formattedDate }</div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-end items-center text-lg -mt-4">
                        <span className="mx-2 text-xs">
                            {isFuture(post.publicationDate) && t("post:planned_for")}
                            {format(new Date(post.publicationDate), "HH:mm  dd/MM/yy")}
                        </span>
                    </div>
                </div>
                <div className="text-base ml-2 mt-2">
                    {post.description}
                </div>
                <div className="flex flex-row text-gray-600 justify-between mt-1 -mb-2.5">
                    <div className="items-center text-gray-400 grid grid-cols-2 w-full mr-5 text-center">
                        <span className="group flex items-center justify-center cursor-pointer hover:text-indigo-500 mr-3 text-xl transition-colors duration-100">
                            <div className="text-base mx-1.5 w-7 text-right">
                                {post.nbComments > 0 && post.nbComments}
                            </div>
                            <div className="-ml-1 cursor-pointer rounded-full bg-indigo-700 bg-opacity-0 group-hover:bg-opacity-10 transition-colors duration-200 w-10 h-10 items-center flex justify-center">
                                <FontAwesomeIcon
                                    icon={faCommentAlt}
                                    size="1x"
                                />
                            </div>
                        </span>
                        <span
                            className="group flex items-center justify-center cursor-pointer mr-3 text-xl"
                            onClick={() => toggleLike(post.thread)}
                        >
                            <div className="text-base mx-1.5 w-7 text-right">
                                {likes > 0 && likes}
                            </div>
                            <div className="-ml-1 cursor-pointer rounded-full bg-red-700 bg-opacity-0 group-hover:bg-opacity-10 transition-colors duration-200 w-10 h-10 items-center flex justify-center">
                                <FontAwesomeIcon
                                    icon={liked ? faSolidHeart: faHeart}
                                    className={`${liked ? "text-red-400" : "hover:text-red-600"} transition-colors`}
                                    size="1x"
                                />
                            </div>
                        </span>
                    </div>
                </div>
                <Divider className="mb-0 mt-4" />
                <CommentList
                    id={post.thread}
                    trendingComment={noTrendingComment ? undefined : post.trendingComment}
                    numberComments={post.nbComments}
                    depth={0}
                    loadComment={post.nbComments !== 0}
                />
            </div>
        </div>
    )
}

export default PostSidebar