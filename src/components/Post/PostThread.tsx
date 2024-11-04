import React, {useCallback, useEffect, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCommentAlt} from "@fortawesome/free-regular-svg-icons"
import {Divider, Modal} from "antd"
import CommentList from "../Comment/CommentList"
import {Comment} from "../../data/thread/types"
import {toggleThreadLike} from "../../data/thread"
import heart from "react-useanimations/lib/heart"
import Animation from "../Animation/Animation"
import { likePopSoundUrl } from "../../constants/AudioFiles"
import { isWeb } from "../../data/app"
import { Haptics, ImpactStyle } from "@capacitor/haptics"
import { LikePreview } from "./types"
import { getLikes } from "./action"
import LoadingSpinner from "../Common/LoadingSpinner"
import StudentAvatar from "../Student/StudentAvatar"
import { Link } from "react-router-dom"
import { useLongPress } from "../../util"
import { Toast } from "@capacitor/toast"
// import { useLongPress } from "use-long-press"

type PostTheadProps = {
    thread: number
    liked: boolean
    likesCount: number
    oldLikes: boolean
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

    const vibrate = async () => {
        try{
            if(isWeb)
                navigator.vibrate?.(7)
            else
                await Haptics.impact({ style: ImpactStyle.Medium })
        }catch(e){
            console.debug("Couldn't vibrate on like")
        }
    }

    const toggleLike = useCallback(async (event?: React.MouseEvent) => {
        if(event && (event.nativeEvent as PointerEvent).pointerType != "mouse")
            return
            
        vibrate()

        if(props.oldLikes) {
            Toast.show({
                text: "Nous avons perdu les anciens likes à cause de Garage.",
                position: "bottom",
                duration: "short",
            })
            return
        }

        setLiked(liked => {
            if(!liked){
                if(isWeb){
                    audio.currentTime = 0
                    audio.play()
                }
            }
            return !liked
        })

        const res = await toggleThreadLike(thread)
        if (res.status === 200) {
            setLiked(res.data)
            setLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1)
        }
    }, [thread, props.oldLikes])

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


    const [likesPreviews, setLikesPreview] = useState<LikePreview[]>([])
    const [likesLoading, setLikesLoading] = useState(false)
    const [likesOpenned, setLikesOpenned] = useState(false)

    const openLikes = useCallback(() => {
        if(props.oldLikes) {
            Toast.show({
                text: "Nous avons perdu les anciens likes à cause de Garage.",
                position: "bottom",
                duration: "short",
            })
            return
        }

        setLikesLoading(true)
        setLikesOpenned(true)
        getLikes(thread).then(res => {
            setLikesPreview(res.data)
            setLikesLoading(false)
        })
        vibrate()
    }, [thread])

    const seeLikes = useCallback((event: React.MouseEvent) => {
        if((event.nativeEvent as PointerEvent).pointerType != "touch"){
            event.stopPropagation()
            openLikes()
        }
    }, [openLikes])

    const closeLikes = useCallback(() => {
        setLikesOpenned(false)
    }, [])

    const likesLongPressBind = useLongPress(openLikes, toggleLike, {
        isPreventDefault: true,
    })
    
    return (
        <>
            <Modal
                className="w-11/12 md:w-1/2 md:max-w-[600px] rounded-xl pb-0 top-6 md:top-14 max-h-[min(80vh,590px)] overflow-scroll scrollbar-thin scrollbar-none"
                visible={likesOpenned}
                footer={null}
                afterClose={closeLikes}
                onCancel={closeLikes}
            >
                <div className="text-center font-medium text-lg my-1.5 sm:mb-3">
                    Likes
                </div>
                {
                    likesLoading ? <div className="pt-48 pb-16">
                        <LoadingSpinner />
                    </div> : 
                        likesPreviews.map(({student}) => <Link to={() => `/student/${student.id}`} key={student.id}>
                            <div className="w-full flex items-center font-semibold text-neutral-600 hover:bg-black/5 p-2 rounded-lg transition-colors cursor-pointer">
                                <StudentAvatar 
                                    id={student.id}
                                    name={student.firstName+" "+student.lastName}
                                    picture={student.picture}
                                    size="large"
                                />
                                <div className="ml-3 text-base flex justify-between w-full">
                                    <span>
                                        {student.firstName+" "+student.lastName}
                                    </span>
                                    <span className="ml-3">
                                        ❤️
                                    </span>
                                </div>
                            </div>
                        </Link>)
                }
            </Modal>
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
                        {...likesLongPressBind}
                    >
                        <div className={"text-base mx-1.5 w-7 text-right " + (props.oldLikes || "sm:hover:underline")} onClick={seeLikes}>
                            {likes > 0 && likes}
                        </div>
                        <div
                            data-dd-privacy="hidden"
                            className={
                                "-ml-1 cursor-pointer rounded-full bg-red-700 bg-opacity-0 transition-colors duration-200 w-10 h-10 items-center flex justify-center "
                                + (props.oldLikes || "group-hover:bg-opacity-10")
                            }>
                            
                            <Animation
                                animation={heart}
                                enabled={liked}
                                size={30.5}
                                className={`${liked && "text-red-400"} ${props.oldLikes || "group-hover:text-red-500"} transition-colors`}
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
