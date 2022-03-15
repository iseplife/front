import React, {useCallback, useEffect, useMemo, useState} from "react"
import {Author} from "../../data/request.type"
import {Link} from "react-router-dom"
import StudentAvatar from "../Student/StudentAvatar"
import {AvatarSizes} from "../../constants/MediaSizes"
import {format, isFuture} from "date-fns"
import {useTranslation} from "react-i18next"
import {formatDateWithTimer} from "../../util"
import {Post} from "../../data/post/types"

type PostAuthorProps = {
    author: Author
    publicationDate: Post["publicationDate"]
    className?: string
}
const PostAuthor: React.FC<PostAuthorProps> = ({author, publicationDate, className = ""}) => {
    const {t} = useTranslation( "post")
    const [formattedDate, setFormattedDate] = useState<string>("")
    useEffect(() => formatDateWithTimer(publicationDate, t, setFormattedDate), [publicationDate])

    const AvatarWrapper = useCallback<React.FC>(({children}) => {
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
        <div className={`flex ${className}`}>
            <AvatarWrapper>
                <StudentAvatar
                    id={author.id}
                    name={author.name}
                    picture={author.thumbnail}
                    pictureSize={AvatarSizes.THUMBNAIL}
                    size="default"
                />
            </AvatarWrapper>
            <div className="items-center ml-2">
                <div className="font-bold -mb-0.5 -mt-0.5">{author.name}</div>
                <div className="text-xs whitespace-nowrap">
                    {isFuture(publicationDate) ?
                        `${t("planned_for")} ${format(new Date(publicationDate), "dd/MM/yy, HH:mm")}` :
                        formattedDate
                    }
                </div>
            </div>
        </div>
    )
}

export default PostAuthor