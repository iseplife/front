import React, {useEffect, useState} from "react"
import {useTranslation} from "react-i18next"
import {formatDateWithTimer} from "../../util"
import StudentAvatar from "../Student/StudentAvatar"
import {AvatarSizes} from "../../constants/MediaSizes"
import {format, isFuture} from "date-fns"
import {Post} from "../../data/post/types"
import PostThread from "./PostThread"

type PostSidebarProps = {
    post: Post
}
const PostSidebar: React.FC<PostSidebarProps> = ({post}) => {
    const {t} = useTranslation(["common", "post"])

    const [formattedDate, setFormattedDate] = useState<string>("")
    useEffect(() => formatDateWithTimer(post.publicationDate, t, setFormattedDate), [post.publicationDate])

    return (
        <div>
            <div className="flex flex-col p-4">
                <div className="w-full flex justify-between mb-1 text-neutral-200 md:text-black">
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
                <div className="text-base ml-2 mt-2 text-neutral-100 md:text-black">
                    {post.description}
                </div>
                <PostThread
                    lightbox={true}
                    thread={post.thread}
                    liked={post.liked}
                    likesCount={post.nbLikes}
                    commentsCount={post.nbComments}
                    forceShowComments={true}
                />
            </div>
        </div>
    )
}

export default PostSidebar