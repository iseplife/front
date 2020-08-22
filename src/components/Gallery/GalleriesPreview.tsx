import React, {useContext, useEffect, useState} from "react"
import {GalleryPreview} from "../../data/gallery/types"
import GalleryCard from "./GalleryCard"
import {useTranslation} from "react-i18next"
import {message, Modal} from "antd"
import Galleries from "../Club/Galleries"
import {getClubGalleries} from "../../data/club"
import {ClubContext} from "../../context/club/context"

const GalleriesPreview: React.FC = () => {
    const {t} = useTranslation("gallery")
    const {state: {club: {data: club}}} = useContext(ClubContext)
    const [visible, setVisible] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [galleriesPreview, setGalleriesPreview] = useState<GalleryPreview[]>([])

    useEffect(() => {
        if (club) {
            setLoading(true)
            getClubGalleries(club.id)
                .then(res => {
                    setGalleriesPreview(res.data.content)
                })
                .catch(e => message.error(e))
                .finally(() => setLoading(false))
        }

    }, [club])

    return (
        <div>
            {galleriesPreview.map(g => (
                <GalleryCard key={g.id} gallery={g}/>
            ))}
            <div className="hover:text-indigo-400 cursor-pointer" onClick={() => setVisible(true)}>
                {t("see_all")}
            </div>
            <Modal
                title={<h1 className="text-gray-800 font-bold text-xl m-0">{t("galleries")}</h1>}
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
            >
                <Galleries/>
            </Modal>
        </div>
    )
}

export default GalleriesPreview