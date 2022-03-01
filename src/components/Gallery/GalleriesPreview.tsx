import React, {useCallback, useContext, useEffect, useLayoutEffect, useState} from "react"
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
    elementId: number
    getGalleriesCallback: (id: number, page?: number) => AxiosPromise<Page<GalleryPreview>>
    className?: string
}

const GalleriesPreview: React.FC<GalleriesPreviewProps> = ({elementId, getGalleriesCallback, className = ""}) => {
    const {t} = useTranslation("gallery")
    const [loading, setLoading] = useState<boolean>()
    const [galleriesPreview, setGalleriesPreview] = useState<GalleryPreview[]>([])

    const [galleriesVisible, setGalleriesVisible] = useState<boolean>(false)
    const openModal = useCallback(() => setGalleriesVisible(true), [])
    const closeModal = useCallback(() => setGalleriesVisible(false), [])

    useEffect(() => {
        setLoading(true)
        getGalleriesCallback(elementId)
            .then(res => {
                setGalleriesPreview(res.data.content)
            })
            .catch(e => message.error(e))
            .finally(() => setLoading(false))

    }, [elementId])

    return <div className={`flex-col px-4 py-3 shadow-sm rounded-lg bg-white my-5 hidden sm:flex ${className}`}>
        <div className="text-neutral-900 font-semibold text-base flex items-center -mt-1">
            <span>{t("club:galleries")}</span>
            <div onClick={openModal}  className="ml-auto py-1 -mr-1 hover:bg-black/5 transition-colors px-2 rounded text-indigo-500 font-normal text-sm grid place-items-center cursor-pointer mt-1">
                {t("gallery:see_all")}
            </div>
        </div>
        
        {loading ? <GalleriesPreviewSkeleton /> :
            <div className="-mt-1">
                {galleriesPreview.map(g => (
                    <GalleryCard key={g.id} gallery={g} />
                ))}
                {galleriesPreview.length == 0 &&
                    <div className="text-center text-gray-400">
                        <FontAwesomeIcon icon={faCameraRetro} size="4x" />
                        <p>{t("no_gallery")}</p>
                    </div>
                }
                <Modal
                    title={<h1 className="text-gray-800 font-bold text-xl m-0">{t("galleries")}</h1>}
                    visible={galleriesVisible}
                    onCancel={closeModal}
                    footer={null}
                >
                    <GalleriesModal elementId={elementId} getGalleriesCallback={getGalleriesCallback} />
                </Modal>
            </div>
        }
    </div>
}

export default GalleriesPreview
