import React, {useCallback, useState} from "react"
import {Button, Modal} from "antd"
import GalleryForm from "./GalleryForm"
import {useTranslation} from "react-i18next"
import {GalleryPreview} from "../../../data/gallery/types"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faImages} from "@fortawesome/free-regular-svg-icons"

type GalleryModalFormProps = {
    feed: number
    clubsAllowedToPublishGallery?: number[]
    mobile?: boolean
    onSubmit?: (g: GalleryPreview) => void
}
const GalleryModalForm: React.FC<GalleryModalFormProps> = ({feed, clubsAllowedToPublishGallery, onSubmit, mobile}) => {
    const {t} = useTranslation("gallery")
    const [visible, setVisible] = useState(false)

    const handleSubmit = useCallback((g: GalleryPreview) => {
        setVisible(false)
        onSubmit && onSubmit(g)
        
    }, [onSubmit])
    return (
        <>
            <Button
                className={`rounded-full px-3 bg-indigo-400 text-white font-semibold mx-auto mb-3 ${!mobile && "hidden sm:block" }`}
                style={{width: "max-content"}}
                onClick={() => setVisible(true)}
            >
                {t("add")} <FontAwesomeIcon icon={faImages} className="ml-2"/>
            </Button>
            <Modal
                className="w-11/12 no-padding-modal rounded-xl overflow-hidden pb-0 top-6 md:top-14"
                visible={visible}
                title={null}
                footer={null}
                onCancel={() => setVisible(false)}
            >
                <GalleryForm feed={feed} clubsAllowedToPublishGallery={clubsAllowedToPublishGallery} onSubmit={handleSubmit}/>
            </Modal>
        </>
    )
}

export default GalleryModalForm
