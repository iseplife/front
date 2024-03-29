import React, {CSSProperties, useMemo} from "react"
import {Link} from "react-router-dom"
import {mediaPath} from "../../../util"
import {GallerySizes} from "../../../constants/MediaSizes"
import {useTranslation} from "react-i18next"
import {EmbedGallery as EmbedGalleryType} from "../../../data/post/types"
import SafeImage from "../../Common/SafeImage"
import "lightbox-react/style.css"
import {faImages, faPlus} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

const PREVIEW_GALLERY_COUNT = 5

const getFormat = (index: number, size: number): CSSProperties | undefined => {
    switch (size) {
        case 1:
        case 2:
            return ({height: "calc(100% - 0.0635rem)"})
        case 3:
            return index === 0 ?
                ({height: "calc(100% - 0.0625rem)"}) :
                ({height: "calc(50% - 0.0625rem)"})
        case 4:
        case 5:
            return index <= 1 ?
                ({height: "calc(50% - 0.0625rem)"}) :
                ({height: "calc(100% / 3 - 0.087rem)"})
    }
}

type EmbedGalleryProps = {
    gallery: EmbedGalleryType
}
const EmbedGallery: React.FC<EmbedGalleryProps> = ({gallery}) => {
    const {t} = useTranslation("gallery")
    const previewLength = useMemo(() => (
        Math.min(gallery.preview.length, PREVIEW_GALLERY_COUNT)
    ), [gallery.preview.length])

    return previewLength ?
        <div>
            <Link to={`/gallery/${gallery.id}`}><h3 className="text-xl text-gray-600 m-0">{gallery.name}</h3></Link>
            <div className="flex flex-col gap-0.5 flex-wrap w-full rounded-xl overflow-hidden" style={{height: 300}}>
                {gallery.preview.slice(0, previewLength).map((img, i) => (
                    <Link
                        key={img.id} to={`/gallery/${gallery.id}${i === previewLength - 1 ? "" : "/" + i}`}
                        className="block w-1/2"
                        style={getFormat(i, previewLength)}
                    >
                        {i === previewLength - 1 ?
                            <div
                                className="relative h-full w-full bg-black text-gray-400 hover:text-white overflow-hidden"
                                style={{backgroundColor: `#${img.color}`}}
                            >
                                <SafeImage
                                    ratio={img.ratio}
                                    className="h-full w-full bg-gray-400 object-cover opacity-50"
                                    src={mediaPath(img.name, GallerySizes.PREVIEW)}
                                    status={img.status}
                                    nsfw={img.nsfw}
                                />
                                <div className="w-full h-full absolute top-0 left-0 bg-neutral-800/60 backdrop-blur-lg text-white grid place-items-center text-4xl font-bold">
                                    <span className="-translate-y-1">+</span>
                                </div>
                            </div> :
                            <div
                                className="hover:bg-black h-full w-full relative overflow-hidden"
                                style={{backgroundColor: `#${img.color}`}}
                            >
                                <SafeImage
                                    ratio={img.ratio}
                                    className="h-full w-full bg-gray-400 object-cover hover:opacity-75"
                                    src={mediaPath(img.name, GallerySizes.PREVIEW)}
                                    status={img.status}
                                    nsfw={img.nsfw}
                                />
                            </div>
                        }
                    </Link>
                ))}
            </div>
        </div> :
        <div className="h-full w-full flex flex-col items-center rounded text-sm text-gray-400 ">
            <FontAwesomeIcon icon={faImages} size="3x"/>
            <p className="text-gray-600">{t("empty")}</p>
        </div>
}
export default EmbedGallery
