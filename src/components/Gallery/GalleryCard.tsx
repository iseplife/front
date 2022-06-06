import React, {useCallback, useMemo, useState} from "react"
import {GalleryPreview} from "../../data/gallery/types"
import {Link} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {mediaPath} from "../../util"
import {GallerySizes} from "../../constants/MediaSizes"
import ImageContainer from "../Common/ImageContainer"
import {faImages, faPlus} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {Image, MediaStatus} from "../../data/media/types"

const PREVIEW_GALLERY_COUNT = 5

type GalleryCardProps = {
    gallery: GalleryPreview
    className?: string
}
const GalleryCard: React.FC<GalleryCardProps> = ({gallery, className}) => {
    const {t} = useTranslation("gallery")
    const [images, setImages] = useState<Image[]>(gallery.preview)
    const previewLength = useMemo(() => Math.min(images.length, PREVIEW_GALLERY_COUNT), [images.length])

    const imageFinishedProcessing = useCallback( (index : number) => () => {
        setImages(prevImages => ([
            ...prevImages,
            {
                ...prevImages[index],
                status: MediaStatus.READY
            }]
        ))
    }, [])

    return (
        <div className={`my-2 ${className}`}>
            <Link to={`/gallery/${gallery.id}`}><h3 className="text-gray-600 m-0">{gallery.name}</h3></Link>
            <div className="flex flex-col flex-wrap content-start h-20 w-full">
                {previewLength ?
                    images.slice(0, previewLength).map((img, i) => (
                        i === previewLength - 1 ?
                            <Link
                                key={img.id}
                                to={`/gallery/${gallery.id}`} className="w-1/4 p-0.5 block" style={{height: "50%"}}
                            >
                                <div className="relative h-full w-full rounded bg-black text-gray-400 hover:text-white">
                                    <ImageContainer
                                        className="h-full w-full rounded bg-gray-400 object-cover opacity-50"
                                        src={mediaPath(img.name, GallerySizes.PREVIEW)}
                                        nsfw={img.nsfw}
                                        status={img.status}
                                        onProcessingFinished={imageFinishedProcessing(i)}
                                        hide
                                    />
                                    <FontAwesomeIcon icon={faPlus} className="absolute z-10" style={{top: "30%", left: "43%"}}/>
                                </div>
                            </Link>
                            :
                            <Link
                                key={img.id}
                                to={`/gallery/${gallery.id}?p=${i}`}
                                className={`p-0.5 block ${i === 0 ? "w-1/2" : "w-1/4"}`}
                                style={{height: i === 0 ? "100%" : "50%"}}
                            >
                                <div className="hover:bg-black rounded h-full w-full">
                                    <ImageContainer
                                        className="h-full w-full bg-gray-400 object-cover hover:opacity-75 rounded"
                                        src={mediaPath(img.name, GallerySizes.PREVIEW)}
                                        nsfw={img.nsfw}
                                        status={img.status}
                                        onProcessingFinished={imageFinishedProcessing(i)}
                                        hide
                                    />
                                </div>
                            </Link>
                    )) :
                    <div className="my-auto w-full text-center rounded text-sm text-gray-400 ">
                        <FontAwesomeIcon icon={faImages} className="text-3xl"/>
                        <div className="text-neutral-500">{t("empty")}</div>
                    </div>
                }
            </div>
        </div>
    )
}
GalleryCard.defaultProps = {
    className: ""
}

export default GalleryCard
