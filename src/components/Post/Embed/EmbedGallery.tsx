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
            return ({height: "100%", width: "50%"})
        case 3:
            return index === 0 ?
                ({height: "100%", width: "50%"}) :
                ({height: "50%", width: "50%"})
        case 4:
        case 5:
            return index <= 1 ?
                ({height: "50%", width: "50%"}) :
                ({height: "33%", width: "50%"})
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
            <div className="flex flex-col flex-wrap w-full" style={{height: 300}}>
                {gallery.preview.slice(0, previewLength).map((img, i) => (
                    <Link
                        key={img.id} to={`/gallery/${gallery.id}${i === previewLength - 1 ? "" : "?p=" + i}`}
                        className="p-1 block"
                        style={getFormat(i, previewLength)}
                    >
                        {i === previewLength - 1 ?
                            <div className="relative h-full w-full rounded bg-black text-gray-400 hover:text-white">
                                <SafeImage
                                    className="h-full w-full rounded bg-gray-400 object-cover opacity-50"
                                    src={mediaPath(img.name, GallerySizes.PREVIEW)}
                                    status={img.status}
                                    nsfw={img.nsfw}
                                />
                                <FontAwesomeIcon icon={faPlus} size="2x" className="text-center absolute z-10 h-8 w-8 -ml-4 -mt-4" style={{top: "50%", left: "50%"}}/>
                            </div> :
                            <div className="hover:bg-black rounded h-full w-full">
                                <SafeImage
                                    className="h-full w-full rounded bg-gray-400 object-cover hover:opacity-75"
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
