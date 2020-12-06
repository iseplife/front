import React, {useMemo} from "react"
import {GalleryPreview} from "../../data/gallery/types"
import {Link} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {IconFA} from "../Common/IconFA"
import {mediaPath} from "../../util"
import {GallerySizes} from "../../constants/MediaSizes"
import SafeImage from "../Common/SafeImage";

const PREVIEW_GALLERY_COUNT = 5

type GalleryCardProps = {
    gallery: GalleryPreview
    className?: string
}
const GalleryCard: React.FC<GalleryCardProps> = ({gallery, className}) => {
    const {t} = useTranslation("gallery")
    const previewLength = useMemo(() => Math.min(gallery.preview.length, PREVIEW_GALLERY_COUNT), [gallery.preview.length])
    return (
        <div className={`my-1 ${className}`}>
            <Link to={`/gallery/${gallery.id}`}><h3 className="font-dinotcb text-gray-600 m-0">{gallery.name}</h3></Link>
            <div className="flex flex-col flex-wrap content-start h-20 w-full">
                {previewLength ?
                    gallery.preview.slice(0, previewLength).map((img, i) => (
                        i === previewLength - 1 ?
                            <Link
                                key={img.id}
                                to={`/gallery/${gallery.id}`} className="w-1/4 p-1 block" style={{height: "50%"}}
                            >
                                <div className="relative h-full w-full rounded bg-black text-gray-400 hover:text-white">
                                    <SafeImage className="h-full w-full rounded bg-gray-400 object-cover opacity-50" src={mediaPath(img.name, GallerySizes.PREVIEW)} nsfw={img.NSFW}/>
                                    <IconFA name="fa-plus" className="absolute z-10" style={{top: "30%", left: "43%"}}/>
                                </div>
                            </Link>
                            :
                            <Link
                                key={img.id}
                                to={`/gallery/${gallery.id}?picture=${img.id}`}
                                className={`p-1 block ${i === 0 ? "w-1/2" : "w-1/4"}`}
                                style={{height: i === 0 ? "100%" : "50%"}}
                            >
                                <div className="hover:bg-black rounded h-full w-full">
                                    <SafeImage className="h-full w-full rounded bg-gray-400 object-cover hover:opacity-75 " src={mediaPath(img.name, GallerySizes.PREVIEW)} nsfw={img.NSFW}/>
                                </div>
                            </Link>
                    )) :
                    <div className="h-full w-full flex flex-col items-center rounded text-sm text-gray-400 ">
                        <IconFA name="fa-images" size="3x"/>
                        <p className="text-gray-600">{t("empty")}</p>
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
