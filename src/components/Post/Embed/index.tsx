import React from "react"
import {Embed as EmbedType, EmbedEnumType} from "../../../data/post/types"
import {mediaPath} from "../../../util"
import {PostSizes} from "../../../constants/MediaSizes"
import EmbedGallery from "./EmbedGallery"
import Poll from "./Poll"


type EmbedProps = {
    embed: EmbedType
}
const Embed: React.FC<EmbedProps> = ({embed}) => {
    switch (embed.embedType) {
        case EmbedEnumType.DOCUMENT:
            return null
        case EmbedEnumType.VIDEO:
            return null
        case EmbedEnumType.POLL:
            return <Poll data={embed} />
        case EmbedEnumType.GALLERY:
            return <EmbedGallery gallery={embed} />
        case EmbedEnumType.IMAGE:
            return <img src={mediaPath(embed.name, PostSizes.PREVIEW)}/>
        default:
            return null
    }
}

export default Embed