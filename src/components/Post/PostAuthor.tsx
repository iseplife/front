import React, {useCallback, useEffect, useState} from "react"
import {Author} from "../../data/request.type"
import {Link} from "react-router-dom"
import StudentAvatar from "../Student/StudentAvatar"
import {AvatarSizes} from "../../constants/MediaSizes"
import {format, isFuture, addSeconds} from "date-fns"
import {useTranslation} from "react-i18next"
import {formatDateWithTimer} from "../../util"
import {Post} from "../../data/post/types"

type PostAuthorProps = {
    author: Author
    publicationDate: Post["publicationDate"]
    className?: string
}
const PostAuthor: React.FC<PostAuthorProps> = ({author, publicationDate, className = ""}) => {
    const {t} = useTranslation("post")
    const [formattedDate, setFormattedDate] = useState<string>("")
    useEffect(() => formatDateWithTimer(publicationDate, t, setFormattedDate), [publicationDate])

    const checkFuturePost = (publicationDate: Date) => isFuture(addSeconds(publicationDate, publicationDate.getMilliseconds() ? -75 : -10)) // for potential clocks diff

    const [futurePost, setFuturePost] = useState(checkFuturePost(publicationDate))

    useEffect(() => {
        setFuturePost(checkFuturePost(publicationDate))
        if (checkFuturePost(publicationDate)) {
            const id = setInterval(() => {
                const future = checkFuturePost(publicationDate)
                if (!future) {
                    setFuturePost(future)
                    clearInterval(id)
                }
            }, 30_000)
            return () => clearInterval(id)
        }
    }, [publicationDate])

    const AvatarWrapper = useCallback<React.FC<{children: React.ReactNode}>>(({children}) => {
        switch (author.authorType) {
            case "CLUB":
                return <Link to={`/club/${author.id}`}>{children}</Link>
            case "STUDENT":
                return <Link to={`/student/${author.id}`}>{children}</Link>
            case "ADMIN":
            default:
                return <span> {children} </span>
        }
    }, [author.id, author.authorType])

    return (
        <AvatarWrapper>
            <div className={`flex ${className} text-black/[85%] group`}>
                <StudentAvatar
                    id={author.id}
                    name={author.name}
                    picture={author.thumbnail}
                    pictureSize={AvatarSizes.THUMBNAIL}
                    size="default"
                />
                <div className="items-center ml-2">
                    <div className="font-bold -mb-0.5 -mt-0.5 group-hover:underline">{author.name}</div>
                    <div className="text-xs whitespace-nowrap">
                        {futurePost ?
                            `${t("planned_for")} ${format(new Date(publicationDate), "dd/MM/yy HH:mm")}` :
                            formattedDate
                        }
                    </div>
                </div>
            </div>
        </AvatarWrapper>
    )
}

export default PostAuthor
