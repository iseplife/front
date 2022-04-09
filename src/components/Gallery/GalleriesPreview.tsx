import React, {useCallback, useEffect, useState} from "react"
import {GalleryPreview} from "../../data/gallery/types"
import GalleryCard from "./GalleryCard"
import {useTranslation} from "react-i18next"
import {message, Modal} from "antd"
import GalleriesModal from "./GalleriesModal"
import {faCameraRetro} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import GalleriesPreviewSkeleton from "../Club/Skeleton/GalleriesPreviewSkeleton"
import {AxiosPromise} from "axios"
import {Page} from "../../data/request.type"

interface GalleriesPreviewProps {
    getGalleriesCallback: (page?: number) => AxiosPromise<Page<GalleryPreview>>
    className?: string
}

const GalleriesPreview: React.FC<GalleriesPreviewProps> = ({getGalleriesCallback, className = ""}) => {
    const {t} = useTranslation("gallery")
    const [loading, setLoading] = useState<boolean>()
    const [galleriesPreview, setGalleriesPreview] = useState<GalleryPreview[]>([])

    const [galleriesVisible, setGalleriesVisible] = useState<boolean>(false)
    const openModal = useCallback(() => setGalleriesVisible(true), [])
    const closeModal = useCallback(() => setGalleriesVisible(false), [])

    useEffect(() => {
        setLoading(true)
        getGalleriesCallback()
            .then(res => {
                setGalleriesPreview(res.data.content)
            })
            .catch(e => message.error(e))
            .finally(() => setLoading(false))

    }, [getGalleriesCallback])

    return (
        <div className={`flex-col px-4 py-3 shadow-sm rounded-lg bg-white my-5 hidden sm:flex ${className}`}>
            <div className="text-neutral-900 font-semibold text-base flex items-center -mt-1">
                <span>{t("club:galleries")}</span>
                { galleriesPreview.length > 0 && (
                    <div
                        className="
                        ml-auto py-1 -mr-1 hover:bg-black/5 transition-colors px-2 rounded text-indigo-500 font-normal
                        text-sm grid place-items-center cursor-pointer mt-1
                    "
                        onClick={openModal}
                    >
                        {t("gallery:see_all")}
                        <Modal
                            title={<h1 className="text-gray-800 font-bold text-xl m-0">{t("galleries")}</h1>}
                            visible={galleriesVisible}
                            onCancel={closeModal}
                            footer={null}
                        >
                            <GalleriesModal getGalleriesCallback={getGalleriesCallback}/>
                        </Modal>
                    </div>
                )}
            </div>

            {loading ? <GalleriesPreviewSkeleton/> :
                <div className="-mt-1">
                    {galleriesPreview.map(g => (
                        <GalleryCard key={g.id} gallery={g}/>
                    ))}
                    {galleriesPreview.length == 0 && (
                        <div className="my-4 w-full text-center rounded text-sm text-neutral-400">
                            <FontAwesomeIcon icon={faCameraRetro} className="text-3xl"/>
                            <div className="text-neutral-500 mt-0.5">{t("no_gallery")}</div>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}

export default GalleriesPreview
