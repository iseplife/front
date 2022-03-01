import React, {useContext, useEffect, useLayoutEffect, useState} from "react"
import {GalleryPreview} from "../../data/gallery/types"
import GalleryCard from "./GalleryCard"
import {useTranslation} from "react-i18next"
import {message, Modal} from "antd"
import GalleriesModal from "./GalleriesModal"
import {getClubGalleries} from "../../data/club"
import {ClubContext} from "../../context/club/context"
import {faCameraRetro} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import GalleriesPreviewSkeleton from "../Club/Skeleton/GalleriesPreviewSkeleton"
import { AxiosPromise } from "axios"
import { Page } from "../../data/request.type"

interface GalleriesPreviewProps {
    visible: boolean,
    setVisible: (visible: boolean) => void
    elementId: number
    getGalleriesCallback: (id: number, page?: number) => AxiosPromise<Page<GalleryPreview>>
}

const GalleriesPreview: React.FC<GalleriesPreviewProps> = ({visible, setVisible, elementId, getGalleriesCallback}) => {
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

    }, [elementId])

    return loading ?
        <GalleriesPreviewSkeleton/> :
        <div className="-mt-1">
            {galleriesPreview.map(g => (
                <GalleryCard key={g.id} gallery={g}/>
            ))}
            {galleriesPreview.length == 0 && 
                <div className="text-center text-gray-400">
                    <FontAwesomeIcon icon={faCameraRetro} size="4x"/>
                    <p>{t("no_gallery")}</p>
                </div>
            }
            <Modal
                title={<h1 className="text-gray-800 font-bold text-xl m-0">{t("galleries")}</h1>}
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
            >
                <GalleriesModal elementId={elementId} getGalleriesCallback={getGalleriesCallback}/>
            </Modal>
        </div>
}

export default GalleriesPreview
