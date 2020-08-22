import React from "react"
import {GalleryPreview} from "../../data/gallery/types"
import {Link} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {IconFA} from "../Common/IconFA"

const PREVIEW_GALLERY_COUNT = 5

type GalleryCardProps = {
    gallery: GalleryPreview
    className?: string
}
const GalleryCard: React.FC<GalleryCardProps> = ({gallery, className}) => {
    const {t} = useTranslation("gallery")
    return (
        <div className={`my-1 ${className}`}>
            <Link to={`/gallery/${gallery.id}`}><h3 className="font-dinotcb text-gray-600 m-0">{gallery.name}</h3></Link>
            <div className="flex flex-col flex-wrap h-20 w-full">
                {gallery.preview.length ?
                    gallery.preview.slice(0, PREVIEW_GALLERY_COUNT).map((img, i) => (
                        i === PREVIEW_GALLERY_COUNT -1 ?
                            <Link
                                key={img.id}
                                to={`/gallery/${gallery.id}`} className="w-1/4 p-1 block" style={{height: "50%"}}
                            >
                                <div className="h-full w-full rounded bg-gray-400"/>
                            </Link>
                            :
                            <Link
                                key={img.id}
                                to={`/gallery/${gallery.id}?picture=${img.id}`}
                                className={`p-1 block ${i === 0 ? "w-1/2" : "w-1/4"}`}
                                style={{height: i === 0 ? "100%" : "50%"}}
                            >
                                <div className="h-full w-full rounded bg-gray-400"/>
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