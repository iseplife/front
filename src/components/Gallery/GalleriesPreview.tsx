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

const GalleriesPreview: React.FC = () => {
    const {t} = useTranslation("gallery")
    const {club: {id}} = useContext(ClubContext)
    const [visible, setVisible] = useState<boolean>(false)
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
                <ClubGalleries club={id}/>
            </Modal>
        </div>
}

export default GalleriesPreview
