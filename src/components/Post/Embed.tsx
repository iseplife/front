import React from "react"
import EmbedType from "../../constants/EmbedType"




type EmbedProps = {
    type: EmbedType
}
const Embed: React.FC<EmbedProps> = ({type}) => {
	switch (type) {
	case EmbedType.GALLERY:
		return (null)
	case EmbedType.POLL:
		return (null)
	case EmbedType.DOCUMENT:
		return (null)
	case EmbedType.VIDEO:
		return (null)
	case EmbedType.IMAGE:
		return (null)
	}
}

export default Embed