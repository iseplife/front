import React, {CSSProperties, useMemo} from "react"
import {RenderImageProps} from "react-photo-gallery"
import {IconFA} from "../Common/IconFA"
import {SelectablePhoto} from "../../pages/default/gallery"
import SafeImage from "../Common/SafeImage";

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
} & RenderImageProps<SelectablePhoto>
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
            style={container}
            className={`relative cursor-pointer overflow-hidden ${selectable && "hover:shadow-outline focus:bg-blue-100"}`}
        >
            <IconFA className={photo.selected ? "absolute z-10" : "hidden"} name="fa-check-circle" type="regular" style={{left: "4px", top: "4px"}}/>
            <SafeImage
                nsfw={photo.nsfw}
                style={photo.selected ? {...selectedImgStyle} : imgStyle}
                src={photo.src}
                height={photo.height}
                width={photo.width}
                alt={photo.alt}
                onClick={(e) => {
                    if (selectable) {
                        onSelect(photo.key as string)
                    } else if (onClick) {
                        onClick(e, {...photo, index: +(photo.key as string)})
                    }
                }}
            />
        </div>
    )
}

export default SelectableImage
