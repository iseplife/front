import React, {useEffect, useState} from "react"
import {GalleryPreview} from "../../data/gallery/types"
import GalleryCard from "./GalleryCard"
import {useTranslation} from "react-i18next"
import {message} from "antd"
import {faCameraRetro} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import GalleriesPreviewSkeleton from "../Club/Skeleton/GalleriesPreviewSkeleton"
import {AxiosPromise} from "axios"
import {Page} from "../../data/request.type"

interface GalleriesTabProps {
    elementId: number
    getGalleriesCallback: (id: number, page?: number) => AxiosPromise<Page<GalleryPreview>>
}

const GalleriesTab: React.FC<GalleriesTabProps> = ({elementId, getGalleriesCallback}) => {
    const {t} = useTranslation("gallery")
    const [loading, setLoading] = useState<boolean>(true)
    const [galleriesPreview, setGalleriesPreview] = useState<GalleryPreview[]>([])

    useEffect(() => {
        if (elementId) {
            getGalleriesCallback(elementId)
                .then(res => {
                    setGalleriesPreview(res.data.content)
                })
                .catch(e => message.error(e))
                .finally(() => setLoading(false))
        }
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
                <div className="my-4 w-full text-center rounded text-sm text-neutral-400 mt-5">
                    <FontAwesomeIcon icon={faCameraRetro} className="text-4xl"/>
                    <div className="text-neutral-500 mt-0.5">{t("no_gallery")}</div>
                </div>
            }
        </div>
}

export default GalleriesTab
