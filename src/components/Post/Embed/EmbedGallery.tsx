import React, {CSSProperties, useMemo} from "react"
import {Link} from "react-router-dom"
import {mediaPath} from "../../../util"
import {GallerySizes, PostSizes} from "../../../constants/MediaSizes"
import {IconFA} from "../../Common/IconFA"
import {useTranslation} from "react-i18next"
import {EmbedGallery as EmbedGalleryType} from "../../../data/post/types"

const PREVIEW_GALLERY_COUNT = 5

const getFormat = (index: number, size: number): CSSProperties | undefined => {
    switch (size) {
        case 2:
            return ({height: "100%", width: "50%"})
        case 3:
            return index === 0 ?
                ({height: "100%", width: "50%"}) :
                ({height: "50%", width: "50%"})
        case 4:
        case 5:
            return index === 0 ?
                ({height: "100%", width: "50%"}) :
                ({height: "25%", width: "25%"})
    }
}

type EmbedGalleryProps = {
    gallery: EmbedGalleryType
}
const EmbedGallery: React.FC<EmbedGalleryProps> = ({gallery}) => {
    const {t} = useTranslation("gallery")
    const previewLength = useMemo(() => Math.min(gallery.preview.length, PREVIEW_GALLERY_COUNT), [gallery.preview.length])

    return gallery.pseudo ?
        <div className="flex flex-col flex-wrap w-full" style={{height: 300}}>
            {previewLength ?
                gallery.preview.map((img, i) => (
                    <div key={i} className="p-1" style={getFormat(i, previewLength)}>
                        <div className="h-full cursor-pointer hover:bg-black rounded">
                            <img
                                className="h-full w-full rounded bg-gray-400 object-cover hover:opacity-50"
                                src={mediaPath(img.name, PostSizes.PREVIEW)}
                            />
                        </div>
                    </div>
                )) :
                <div className="h-full w-full flex flex-col items-center rounded text-sm text-gray-400 ">
                    <IconFA name="fa-images" size="3x"/>
                    <p className="text-gray-600">{t("empty")}</p>
                </div>
            }
        </div> :
        <div className="flex flex-col flex-wrap content-start h-20 w-full">
            {previewLength ?
                gallery.preview.slice(0, previewLength).map((img, i) => (
                    i === previewLength - 1 ?
                        <Link
                            key={img.id}
                            to={`/gallery/${gallery.id}`} className="w-1/4 p-1 block" style={{height: "50%"}}
                        >
                            <div className="relative h-full w-full rounded bg-black text-gray-400 hover:text-white">
                                <img className="h-full w-full rounded bg-gray-400 object-cover opacity-50" src={mediaPath(img.name, GallerySizes.PREVIEW)}/>
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
                                <img className="h-full w-full rounded bg-gray-400 object-cover hover:opacity-75 " src={mediaPath(img.name, GallerySizes.PREVIEW)}/>
                            </div>
                        </Link>
                )) :
                <div className="h-full w-full flex flex-col items-center rounded text-sm text-gray-400 ">
                    <IconFA name="fa-images" size="3x"/>
                    <p className="text-gray-600">{t("empty")}</p>
                </div>
            }
        </div>
}
export default EmbedGallery