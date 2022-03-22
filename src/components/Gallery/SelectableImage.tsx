import React, {CSSProperties, useMemo} from "react"
import {RenderImageProps} from "react-photo-gallery"
import {GalleryPhoto} from "../../pages/default/gallery"
import SafeImage from "../Common/SafeImage"
import {faCheckCircle} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

const imgStyle = {
    transition: "transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s"
}
const selectedImgStyle = {
    transform: "translateZ(0px) scale3d(0.9, 0.9, 1)",
    transition: "transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s"
}

type SelectableImageProps = {
    selectable: boolean
    onSelect: (key: string) => void
} & RenderImageProps<GalleryPhoto>
const SelectableImage: React.FC<SelectableImageProps> = ({index, photo, margin, direction, top, left, selectable, onClick, onSelect}) => {
    //calculate x,y scale
    const sx = (100 - (30 / photo.width) * 100) / 100
    const sy = (100 - (30 / photo.height) * 100) / 100
    selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`

    const container: CSSProperties = useMemo(() => ({
        position: direction === "column" ? "absolute" : "relative",
        margin,
        left, // ignored when position is relative
        top,  // ignored when position is relative
        height: photo.height,
        width: photo.width
    }), [direction, left, margin, photo.height, photo.width, top])

    return (
        <div
            key={index}
            style={container}
            className={`relative cursor-pointer overflow-hidden ${selectable && "hover:shadow-outline focus:bg-blue-100"}`}
        >
            <FontAwesomeIcon icon={faCheckCircle} className={photo.selected ? "absolute z-10" : "hidden"} style={{left: "4px", top: "4px"}}/>
            <SafeImage
                nsfw={photo.nsfw}
                status={photo.status}
                style={photo.selected ? {...selectedImgStyle} : imgStyle}
                src={photo.src}
                height={photo.height}
                width={photo.width}
                alt={photo.alt}
                onClick={(e) => {
                    if (selectable) {
                        onSelect(photo.key as string)
                    } else if (onClick) {
                        onClick(e, {...photo, index})
                    }
                }}
            />
        </div>
    )
}

export default SelectableImage
