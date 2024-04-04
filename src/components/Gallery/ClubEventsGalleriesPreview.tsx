import React, {useEffect, useState} from "react"
import GalleryCard from "./GalleryCard"
import {useTranslation} from "react-i18next"
import {message} from "antd"
import {faCameraRetro} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import GalleriesPreviewSkeleton from "../Club/Skeleton/GalleriesPreviewSkeleton"
import {AxiosPromise} from "axios"
import {Page} from "../../data/request.type"
import { EventGalleryPreview } from "../../data/club/types"

interface ClubEventsGalleriesPreviewProps {
    loading?: boolean
    getGalleriesCallback: (page?: number) => AxiosPromise<Page<EventGalleryPreview>>
    seeAll: () => void
    className?: string
}

const ClubEventsGalleriesPreview: React.FC<ClubEventsGalleriesPreviewProps> = ({ loading: _loading = false, getGalleriesCallback, seeAll, className = "" }) => {
    const {t} = useTranslation("gallery")
    const [loading, setLoading] = useState<boolean>(_loading)
    const [galleriesPreview, setGalleriesPreview] = useState<EventGalleryPreview[]>([])
    
    useEffect(() => {
        if (!_loading) {
            setLoading(true)
            getGalleriesCallback()
                .then(res => {
                    setGalleriesPreview(res.data.content)
                })
                .catch(e => message.error(e))
                .finally(() => setLoading(false))
        }
    }, [getGalleriesCallback, _loading])

    return (
        <div className={`flex-col px-4 py-3 shadow-sm rounded-lg bg-white my-5 hidden sm:flex ${className}`}>
            <div className="text-neutral-900 font-semibold text-base items-center -mt-1 flex flex-col md:flex-row">
                <span className="block md:flex">{t("club:events_galleries")}</span>
                { galleriesPreview.length > 0 && (
                    <div
                        className="
                        md:ml-auto py-1 md:-mr-1 hover:bg-black/5 transition-colors px-2 rounded text-indigo-500 font-normal
                        text-sm grid place-items-center cursor-pointer mt-1
                    "
                        onClick={seeAll}
                    >
                        {t("gallery:see_all")}
                    </div>
                )}
            </div>

            {loading ? <GalleriesPreviewSkeleton/> :
                <div className="-mt-1">
                    {galleriesPreview.map(eg => (
                        <GalleryCard key={eg.gallery.id} {...eg} />
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

export default ClubEventsGalleriesPreview
