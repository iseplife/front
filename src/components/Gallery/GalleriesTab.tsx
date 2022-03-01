import React, {useContext, useEffect, useLayoutEffect, useState} from "react"
import {GalleryPreview} from "../../data/gallery/types"
import GalleryCard from "./GalleryCard"
import {useTranslation} from "react-i18next"
import {message, Modal} from "antd"
import ClubGalleries from "../Club/ClubGalleries"
import {getClubGalleries} from "../../data/club"
import {ClubContext} from "../../context/club/context"
import {faCameraRetro} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import GalleriesPreviewSkeleton from "../Club/Skeleton/GalleriesPreviewSkeleton"

const GalleriesTab: React.FC = () => {
    const {t} = useTranslation("gallery")
    const {club: {id}} = useContext(ClubContext)
    const [loading, setLoading] = useState<boolean>()
    const [galleriesPreview, setGalleriesPreview] = useState<GalleryPreview[]>([])

    useEffect(() => {
        setLoading(true)
        getClubGalleries(id)
            .then(res => {
                setGalleriesPreview(res.data.content)
            })
            .catch(e => message.error(e))
            .finally(() => setLoading(false))

    }, [id])

    return loading ?
        <GalleriesPreviewSkeleton/> :
        <div>
            {galleriesPreview.map(g => (
                <div className="flex flex-col px-4 py-2 shadow-sm rounded-lg bg-white my-5">
                    <GalleryCard key={g.id} gallery={g}/>
                </div>
            ))}
            {galleriesPreview.length == 0 && 
                <div className="text-center text-gray-400">
                    <FontAwesomeIcon icon={faCameraRetro} size="4x"/>
                    <p>{t("no_gallery")}</p>
                </div>
            }
        </div>
}

export default GalleriesTab