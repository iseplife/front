import React from "react"
import {Embed as EmbedType, EmbedEnumType, Post} from "../../../data/post/types"
import EmbedGallery from "./EmbedGallery"
import Poll from "./Poll"
import VideoContainer from "./VideoContainer"
import EmbedImages from "./EmbedImages"
import EmbedDocuments from "./EmbedDocuments"


type EmbedProps = {
    embed: EmbedType
    post: Post
}
const Embed: React.FC<EmbedProps> = ({embed, post}) => {
    
    switch (embed.embedType) {
        case EmbedEnumType.VIDEO:
            return <VideoContainer data={embed} />
        case EmbedEnumType.POLL:
            return <Poll data={embed} />
        case EmbedEnumType.DOCUMENT:
            return <EmbedDocuments data={embed} />
        case EmbedEnumType.GALLERY:
            return <EmbedGallery gallery={embed} />
        case EmbedEnumType.IMAGE:
            return <EmbedImages images={embed.images} post={post}/>
        default:
            return null
    }
}

export default Embed
