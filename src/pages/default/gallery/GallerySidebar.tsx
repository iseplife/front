import React, {useCallback, useEffect, useState} from "react"
import {AvatarSizes} from "../../../constants/MediaSizes"
import {format} from "date-fns"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCommentAlt, faHeart} from "@fortawesome/free-regular-svg-icons"
import {faHeart as faSolidHeart} from "@fortawesome/free-solid-svg-icons"
import {Divider} from "antd"
import CommentList from "../../../components/Comment/CommentList"
import StudentAvatar from "../../../components/Student/StudentAvatar"
import {getThread, toggleThreadLike} from "../../../data/thread"
import {SidebarProps} from "../../../components/Common/Lightbox"
import {Gallery} from "../../../data/gallery/types"
import {GalleryPhoto} from "./index"

type GallerySidebarProps = {
    gallery: Gallery
} & SidebarProps<GalleryPhoto>
const GallerySidebar: React.FC<GallerySidebarProps> = ({gallery, currentImage}) => {
    const [liked, setLiked] = useState<boolean>(false)
    const [nbLikes, setNbLikes] = useState<number>(0)
    const [nbComments, setNbComments] = useState<number>(0)

    const toggleLike = useCallback(async () => {
        const res = await toggleThreadLike(currentImage.thread)
        if (res.status === 200) {
            setLiked(res.data)
            setNbLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1)
        }
    }, [currentImage.thread])

    useEffect(() => {
        getThread(currentImage.thread).then(res => {
            setLiked(res.data.liked)
            setNbComments(res.data.nbComments)
            setNbLikes(res.data.nbLikes)
        })
    }, [currentImage.thread])

    return (
        <div>
            <div className="flex flex-col p-4">
                <div className="w-full flex justify-between mb-1">
                    <div className="flex">
                        <StudentAvatar
                            id={gallery.club.id}
                            name={gallery.club.name}
                            picture={gallery.club.logoUrl}
                            pictureSize={AvatarSizes.THUMBNAIL}
                            showPreview
                            size="large"
                        />
                        <div className="items-center ml-3">
                            <div className="font-bold -mb-0.5 text-base">{gallery.club.name}</div>
                        </div>
                    </div>
                    <div className="flex flex-row justify-end items-center text-lg -mt-4">
                        <span className="mx-2 text-xs">
                            {format(new Date(gallery.creation), "HH:mm  dd/MM/yy")}
                        </span>
                    </div>
                </div>
                <div className="text-base ml-2 mt-2">
                    {gallery.name}
                </div>
                <div className="flex flex-row text-gray-600 justify-between mt-1 -mb-2.5">
                    <div className="items-center text-gray-400 grid grid-cols-2 w-full mr-5 text-center">
                        <span className="group flex items-center justify-center cursor-pointer hover:text-indigo-500 mr-3 text-xl transition-colors duration-100">
                            <div className="text-base mx-1.5 w-7 text-right">
                                {nbComments > 0 && nbComments}
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
                            onClick={toggleLike}
                        >
                            <div className="text-base mx-1.5 w-7 text-right">
                                {nbLikes > 0 && nbLikes}
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
                    id={currentImage.thread}
                    numberComments={nbComments}
                    depth={0}
                    loadComment={nbComments !== 0}
                />
            </div>
        </div>
    )
}

export default GallerySidebar