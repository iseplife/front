import React, {useMemo} from "react"
import {GalleryPreview} from "../../data/gallery/types"
import {Link} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {mediaPath} from "../../util"
import {GallerySizes} from "../../constants/MediaSizes"
import SafeImage from "../Common/SafeImage"
import {faImages, faPlus} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { EventPreview } from "../../data/event/types"

const PREVIEW_GALLERY_COUNT = 5

type GalleryCardProps = {
    gallery: GalleryPreview
    event?: EventPreview
    className?: string
}
const GalleryCard: React.FC<GalleryCardProps> = ({gallery, event, className}) => {
    const {t} = useTranslation("gallery")
    const previewLength = useMemo(() => Math.min(gallery.preview.length, PREVIEW_GALLERY_COUNT), [gallery.preview.length])
    return (
        <div className={`my-2 ${className}`}>
            <Link to={`/gallery/${gallery.id}`}>
                <div className={`text-gray-600 m-0 flex items-center ${event && "mb-1"}`}>
                    {event &&
                        <div className="w-6 h-6 2xl:h-5 2xl:w-5 relative mr-2 flex-shrink-0">
                            <div className="bg-neutral-100 w-full h-full mx-auto sm:mx-0 rounded shadow overflow-hidden relative flex flex-col flex-shrink-0">
                                <div className="bg-red-500 w-full h-2 2xl:h-1.5 flex-shrink-0" />
                            </div>
                        </div>
                    }
                    <div className="whitespace-nowrap 2xl:flex w-full overflow-hidden text-ellipsis leading-4">
                        {event && <b className="mr-2 block">{event?.title}</b>}
                        <div className={`w-full text-ellipsis overflow-hidden ${!event && "font-semibold"}`}>{gallery.name}</div>
                    </div>
                </div>
            </Link>
            <div className="flex flex-col flex-wrap content-start h-20 w-full">
                {previewLength ?
                    gallery.preview.slice(0, previewLength).map((img, i) => (
                        i === previewLength - 1 ?
                            <Link
                                key={img.id}
                                to={`/gallery/${gallery.id}`} className="w-1/4 p-0.5 block" style={{height: "50%"}}
                            >
                                <div className="relative h-full w-full rounded bg-black text-gray-400 hover:text-white overflow-hidden" style={{backgroundColor: `#${img.color}`}}>
                                    <SafeImage
                                        ratio={img.ratio}
                                        className="h-full w-full rounded bg-gray-400 object-cover opacity-50"
                                        src={mediaPath(img.name, GallerySizes.THUMBNAIL)}
                                        nsfw={img.nsfw}
                                        status={img.status}
                                    />
                                    <FontAwesomeIcon icon={faPlus} className="absolute z-10" style={{top: "30%", left: "43%"}}/>
                                </div>
                            </Link>
                            :
                            <Link
                                key={img.id}
                                to={`/gallery/${gallery.id}/${i}`}
                                className={`p-0.5 block ${i === 0 ? "w-1/2" : "w-1/4"}`}
                                style={{height: i === 0 ? "100%" : "50%"}}
                            >
                                <div className="hover:bg-black rounded h-full w-full relative overflow-hidden" style={{backgroundColor: `#${img.color}`}}>
                                    <SafeImage
                                        ratio={img.ratio}
                                        className="h-full w-full bg-gray-400 object-cover hover:opacity-75 rounded"
                                        src={mediaPath(img.name, i === 0 ? GallerySizes.PREVIEW : GallerySizes.THUMBNAIL)}
                                        nsfw={img.nsfw}
                                        status={img.status}
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
