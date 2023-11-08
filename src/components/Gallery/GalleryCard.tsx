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
    showTitle?: boolean
}
const GalleryCard: React.FC<GalleryCardProps> = ({gallery, event, className, showTitle = true}) => {
    const {t} = useTranslation("gallery")
    const previewLength = useMemo(() => Math.min(gallery.preview.length, PREVIEW_GALLERY_COUNT), [gallery.preview.length])
    return (
        <div className={`mt-2 ${className} ${!event && "mt-0 sm:mt-2"}`}>
            <Link to={`/gallery/${gallery.id}`}>
                <div className={`text-gray-600 m-0 flex items-center ${event && "mb-1"}`}>
                    {event &&
                        <div className="w-6 h-6 2xl:h-5 2xl:w-5 relative mr-2 flex-shrink-0">
                            <div className="bg-neutral-100 w-full h-full mx-auto sm:mx-0 rounded shadow overflow-hidden relative flex flex-col flex-shrink-0">
                                <div className="bg-red-500 w-full h-2 2xl:h-1.5 flex-shrink-0" />
                            </div>
                        </div>
                    }
                    { showTitle && 
                    <div className="whitespace-nowrap 2xl:flex w-full overflow-hidden leading-4">
                        {event && <b className="mr-2 block">{event?.title}</b>}
                        <div className={`w-full whitespace-normal line-clamp-1 hover:opacity-80 duration-100 ${!event && "font-semibold text-lg sm:text-base mb-1 sm:mb-0"} ${event && "text-xs "}`} >{gallery.name}</div>
                    </div> }
                </div>
            </Link>
            <div className={`grid grid-col-4 grid-flow-col gap-0.5 rounded-xl overflow-hidden ${!showTitle && "mt-2 sm:mt-0"}`}>
                {previewLength ?
                    gallery.preview.slice(0, previewLength).map((img, i) => (
                        i === previewLength - 1 ?
                            <Link
                                key={img.id}
                                to={`/gallery/${gallery.id}`} className="block"
                            >
                                <div className="relative h-full w-full duration-100 overflow-hidden aspect-[5/2]" style={{backgroundColor: `#${img.color}`}}>
                                    <SafeImage
                                        ratio={2.5}
                                        className="h-full w-full object-cover"
                                        src={mediaPath(img.name, GallerySizes.THUMBNAIL)}
                                        nsfw={img.nsfw}
                                        status={img.status}
                                    />
                                    <div className="w-full h-full bg-neutral-800/60 hover:text-white text-gray-200 backdrop-blur-lg duration-100 absolute flex items-center justify-center"><FontAwesomeIcon icon={faPlus}/></div>
                                </div>
                            </Link>
                            :
                            <Link
                                key={img.id}
                                to={`/gallery/${gallery.id}/${i}`}
                                className={`block ${i === 0 ? "row-span-2 col-span-2" : "row-span-1 col-span-1"}`}
                            >
                                <div className="relative h-full w-full overflow-hidden aspect-[5/2]" style={{backgroundColor: `#${img.color}`}}>
                                    <SafeImage
                                        ratio={2.5}
                                        className="h-full w-full object-cover"
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
