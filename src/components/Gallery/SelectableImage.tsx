import React, {CSSProperties, useCallback, useMemo} from "react"
import {PhotoProps, RenderImageProps} from "react-photo-gallery"
import {GalleryPhoto} from "../../pages/default/gallery"
import SafeImage from "../Common/SafeImage"
import {faCheckCircle} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faCircle } from "@fortawesome/free-regular-svg-icons"

const imgStyle = {
    transition: "transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s"
}
const selectedImgStyle = {
    transform: "translateZ(0px) scale3d(0.9, 0.9, 1)",
    transition: "transform .135s cubic-bezier(0.0,0.0,0.2,1),opacity linear .15s"
}

type SelectableImageProps = {
    selectable: boolean
    photoRef: React.RefObject<HTMLDivElement>,
    onSelect: (key: string) => void
    onLoaded: (photo: PhotoProps<GalleryPhoto>) => void
} & RenderImageProps<GalleryPhoto>
const SelectableImage: React.FC<SelectableImageProps> = ({ index, photo, margin, direction, top, left, selectable, photoRef, onClick, onSelect, onLoaded: _onLoaded}) => {
    //calculate x,y scale
    const sx = (100 - (30 / photo.width) * 100) / 100
    const sy = (100 - (30 / photo.height) * 100) / 100
    selectedImgStyle.transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`

    const onLoaded = useCallback(() => 
        _onLoaded(photo)
    , [_onLoaded, photo])

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
            ref={photoRef}
            key={index}
            style={{
                ...container,
                backgroundColor: `#${photo.color}`
            }}
            className={`relative cursor-pointer overflow-hidden ${selectable && "hover:shadow-outline focus:bg-blue-100"}`}
            onClick={(e) => {
                if (selectable)
                    onSelect(photo.key as string)
                else
                    onClick?.(e, { ...photo, index })
            }}
        >
            <SafeImage
                nsfw={photo.nsfw}
                status={photo.status}
                style={photo.selected ? {...selectedImgStyle} : imgStyle}
                src={photo.src}
                ratio={photo.ratio}
                alt={photo.alt}
                onLoaded={onLoaded}
            />
            {photo.selected && <>
                <div className="bg-neutral-300/40 w-full h-full absolute top-0" />
                <FontAwesomeIcon icon={faCheckCircle} className="absolute m-2 top-0 text-gray-500 text-lg" />
            </>}
            {!photo.selected && selectable && <>
                <div className="w-full h-full absolute top-0" />
                <FontAwesomeIcon icon={faCircle} className="absolute m-2 top-0 text-gray-300 text-lg" />
            </>}
        </div>
    )
}

export default SelectableImage
