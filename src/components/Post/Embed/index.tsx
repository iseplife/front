import React from "react"
import {Embed as EmbedType, EmbedEnumType, Post} from "../../../data/post/types"
import EmbedGallery from "./EmbedGallery"
import Poll from "./Poll"
import Video from "./Video"
import EmbedImages from "./EmbedImages"
import EmbedDocuments from "./EmbedDocuments"
import { Video as VideoType } from "../../../data/media/types"
import EmbedRichLink from "./EmbedRichLink"


type EmbedProps = {
    embed: EmbedType
    post: Post
    selected?: boolean
}
const Embed: React.FC<EmbedProps> = ({embed, post, selected}) => {
    
    switch (embed.embedType) {
        case EmbedEnumType.VIDEO:
            return <Video data={embed} postId={post.id} postEmbed={post.embed as VideoType & {embedType: EmbedEnumType.VIDEO}} />
        case EmbedEnumType.POLL:
            return <Poll data={embed} postId={post.id} />
        case EmbedEnumType.DOCUMENT:
            return <EmbedDocuments data={embed} />
        case EmbedEnumType.GALLERY:
            return <EmbedGallery gallery={embed} />
        case EmbedEnumType.IMAGE:
            return embed.images && embed.images?.length ? <EmbedImages images={embed.images} post={post} selected={selected}/> : <></>
        case EmbedEnumType.RICH_LINK:
            return <EmbedRichLink data={embed} />
        default:
            return null
    }
}

export default Embed
