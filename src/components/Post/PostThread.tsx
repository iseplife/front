import React, {useCallback, useEffect, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCommentAlt} from "@fortawesome/free-regular-svg-icons"
import {Divider} from "antd"
import CommentList from "../Comment/CommentList"
import {Comment} from "../../data/thread/types"
import {toggleThreadLike} from "../../data/thread"
import heart from "react-useanimations/lib/heart"
import Animation from "../Animation/Animation"
import { likePopSoundUrl } from "../../constants/AudioFiles"
import { isWeb } from "../../data/app"
import { Haptics, ImpactStyle } from "@capacitor/haptics"

type PostTheadProps = {
    thread: number
    liked: boolean
    likesCount: number
    commentsCount: number
    forceShowComments: boolean
    trendingComment?: Comment
    lightboxView?: boolean
}
const audio = new Audio(likePopSoundUrl)
const PostThread: React.FC<PostTheadProps> = (props) => {
    const {commentsCount, thread, trendingComment, lightboxView} = props
    const [showComments, setShowComments] = useState<boolean>(props.forceShowComments)
    const [liked, setLiked] = useState<boolean>(props.liked)
    const [likes, setLikes] = useState<number>(props.likesCount)
    const [noTrendingComment, setNoTrendingComment] = useState<boolean>(false)
    const [alreadyMore, setAlreadyMore] = useState<boolean>(false)

    const showMoreCommentsCallback = useCallback(() => setShowComments(true), [])

    const toggleLike = useCallback(async () => {
        try{
            if(isWeb)
                navigator.vibrate?.(7)
            else
                await Haptics.impact({ style: ImpactStyle.Medium })
        }catch(e){
            console.log("Couldn't vibrate on like")
        }
        setLiked(liked => {
            if(!liked){
                audio.currentTime = 0
                audio.play()
            }
            return !liked
        })

        const res = await toggleThreadLike(thread)
        if (res.status === 200) {
            setLiked(res.data)
            setLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1)
        }
    }, [thread])

    useEffect(() => {
        if (!showComments && alreadyMore)
            setNoTrendingComment(true)
        else if (showComments) {
            setAlreadyMore(true)
            setShowComments(true)
        }
    }, [showComments])

    useEffect(() => {
        setLikes(props.likesCount)
        setLiked(props.liked)
    }, [props.likesCount, props.liked])

    return (
        <>
            <div className="flex flex-row text-gray-600 justify-between mt-1 -mb-2.5">
                <div className="items-center text-gray-400 grid grid-cols-2 w-full mr-5 text-center">
                    <span
                        className="
                            group flex items-center justify-center cursor-pointer
                            hover:text-indigo-500 mr-3 text-xl transition-colors duration-100
                        "
                        onClick={() => props.forceShowComments || setShowComments(!showComments)}
                    >
                        <div className="text-base mx-1.5 w-7 text-right">
                            {commentsCount > 0 && commentsCount}
                        </div>
                        <div
                            className="-ml-1 cursor-pointer rounded-full bg-indigo-700 bg-opacity-0 group-hover:bg-opacity-10 transition-colors duration-200 w-10 h-10 items-center flex justify-center">
                            <FontAwesomeIcon
                                icon={faCommentAlt}
                                size="1x"
                            />
                        </div>
                    </span>
                    <span
                        className="group flex items-center justify-center cursor-pointer mr-3 text-xl"
                        onClick={toggleLike}
                    >
                        <div className="text-base mx-1.5 w-7 text-right">
                            {likes > 0 && likes}
                        </div>
                        <div
                            className="-ml-1 cursor-pointer rounded-full bg-red-700 bg-opacity-0 group-hover:bg-opacity-10 transition-colors duration-200 w-10 h-10 items-center flex justify-center">
                            
                            <Animation
                                animation={heart}
                                enabled={liked}
                                size={30.5}
                                className={`${liked && "text-red-400"} group-hover:text-red-500 transition-colors`}
                            />
                        </div>
                    </span>
                </div>
            </div>
            {((props.trendingComment && !noTrendingComment) || showComments) && (
                <>
                    <Divider className="mb-0 mt-4"/>
                    <CommentList
                        lightboxView={lightboxView}
                        showMoreComments={showMoreCommentsCallback}
                        showComments={showComments}
                        trendingComment={noTrendingComment ? undefined : trendingComment}
                        numberComments={commentsCount}
                        id={thread}
                        depth={0}
                        loadComment={commentsCount !== 0}
                    />
                </>
            )}
        </>
    )
}

export default PostThread