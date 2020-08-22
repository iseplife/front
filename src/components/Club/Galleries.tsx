import React from "react"
import {Gallery, Media} from "../../data/gallery/types"
import {Avatar, Divider} from "antd"
import {Link} from "react-router-dom"
import GallerySkeleton from "./Skeletons/GallerySkeleton"
import {useTranslation} from "react-i18next"

const IMAGE_PREVIEW_AMOUNT = 3

type GalleriesProps = {
    galleries: Gallery[]
    loading: boolean
}
const Galleries: React.FC<GalleriesProps> = ({galleries, loading}) => {
    const {t} = useTranslation("club")
    return (
        <div className="w-full">
            {loading ?
                galleries.map((gallery: Gallery) => (
                    <div className="w-full text-center h-56" key={gallery.id}>
                        <Divider orientation="left" className="text-gray-600 text-xs">{gallery.name}</Divider>
                        <div className="flex flex-wrap flex-row h-48">
                            <div className="w-1/2">
                                <Avatar
                                    key={gallery.coverImage.id}
                                    shape="square"
                                    className="m-px w-full h-40 float-right"
                                    src={gallery.coverImage.name}
                                />
                            </div>
                            <div className="flex flex-wrap flex-row w-1/2 justify-start">
                                {
                                    gallery.previewImages.map((photo: Media, index: number, g) => (
                                        index < IMAGE_PREVIEW_AMOUNT ?
                                            <Avatar shape="square" className="m-px h-20" style={{width: "48%"}} src={photo.name} key={index}/> :
                                            <Link to={`/gallery/${gallery.id}`} style={{width: "48%"}} key={index}>
                                                <Avatar shape="square" className="m-px w-full h-20 cursor-pointer" src={photo.name} key={index}/>
                                                <div className="relative w-full h-20 bg-black opacity-75 cursor-pointer flex flex-col justify-center" style={{top: "-50%"}}>
                                                    <div className="text-white font-bold text-lg">+ { gallery.previewImages.length - (1 + IMAGE_PREVIEW_AMOUNT)}</div>
                                                    <div className="text-white">{t("pictures")}</div>
                                                </div>
                                            </Link>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )) : <GallerySkeleton/>
            }
        </div>

    )
}

export default Galleries