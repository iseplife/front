import React from "react"
import Gallery, {PhotoProps} from "react-photo-gallery"
import EmbedEnumType from "../../constants/EmbedEnumType"
import {Embed as EmbedType} from "../../data/post/types"


type EmbedProps = {
    embed: EmbedType
}
const Embed: React.FC<EmbedProps> = ({embed}) => {
	switch (embed.embedType) {
	case EmbedEnumType.GALLERY:
		const photos: PhotoProps[] = embed.previewImages.map(img => ({
			src: "https://iseplife.s3.eu-west-3.amazonaws.com/" + img.name,
			width: 1,
			height: 1
		}))

		return <Gallery photos={photos} direction="row" margin={3}/>
	case EmbedEnumType.POLL:
		return null
	case EmbedEnumType.DOCUMENT:
		return null
	case EmbedEnumType.VIDEO:
		return null
	case EmbedEnumType.IMAGE:
		return null
	}
}

export default Embed