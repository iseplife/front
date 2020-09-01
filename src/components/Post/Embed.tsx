import React from "react"
import Gallery, {PhotoProps} from "react-photo-gallery"
import {Gallery as GalleryType} from "../../data/gallery/types"
import {Embed as EmbedType, EmbedEnumType} from "../../data/post/types"
import {mediaPath} from "../../util"


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
            return null
        case EmbedEnumType.GALLERY:
            let photos: PhotoProps[] = embed.images.map(img => ({
                src: mediaPath(img.name) as string,
                width: 1,
                height: 1
            }))

            return <Gallery photos={photos} direction="row" margin={3}/>
        case EmbedEnumType.IMAGE:
            return <img/>
        default:
            return null
    }
}

export default Embed