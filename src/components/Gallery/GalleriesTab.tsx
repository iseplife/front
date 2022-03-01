import React, {useEffect, useState} from "react"
import {GalleryPreview} from "../../data/gallery/types"
import GalleryCard from "./GalleryCard"
import {useTranslation} from "react-i18next"
import {message} from "antd"
import {faCameraRetro} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import GalleriesPreviewSkeleton from "../Club/Skeleton/GalleriesPreviewSkeleton"
import { AxiosPromise } from "axios"
import { Page } from "../../data/request.type"

interface GalleriesTabProps {
    elementId: number
    getGalleriesCallback: (id: number, page?: number) => AxiosPromise<Page<GalleryPreview>>
}

const GalleriesTab: React.FC<GalleriesTabProps> = ({elementId, getGalleriesCallback}) => {
    const {t} = useTranslation("gallery")
    const [loading, setLoading] = useState<boolean>()
    const [galleriesPreview, setGalleriesPreview] = useState<GalleryPreview[]>([])

    useEffect(() => {
        setLoading(true)
        getGalleriesCallback(elementId)
            .then(res => {
                setGalleriesPreview(res.data.content)
            })
            .catch(e => message.error(e))
            .finally(() => setLoading(false))

    }, [getGalleriesCallback, elementId])

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
