import React, {useCallback, useState} from "react"
import {Button, Modal} from "antd"
import GalleryForm from "./GalleryForm"
import {useTranslation} from "react-i18next"
import {GalleryPreview} from "../../../data/gallery/types"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faImages} from "@fortawesome/free-regular-svg-icons"

type GalleryModalFormProps = {
    feed: number
    onSubmit?: (g: GalleryPreview) => void
}
const GalleryModalForm: React.FC<GalleryModalFormProps> = ({feed, onSubmit}) => {
    const {t} = useTranslation("gallery")
    const [visible, setVisible] = useState(false)

    const handleSubmit = useCallback((g: GalleryPreview) => {
        setVisible(false)
        onSubmit && onSubmit(g)
    }, [onSubmit])
    return (
        <>
            <Button
                className="shadow-sm rounded px-3 bg-indigo-200 text-indigo-400 font-bold"
                style={{width: "max-content"}}
                onClick={() => setVisible(true)}
            >
                {t("add")} <FontAwesomeIcon icon={faImages} className="ml-2"/>
            </Button>
            <Modal
                className="w-11/12 no-padding-modal"
                visible={visible}
                title={null}
                footer={null}
                onCancel={() => setVisible(false)}
            >
                <GalleryForm feed={feed} onSubmit={handleSubmit}/>
            </Modal>
        </>
    )
}

export default GalleryModalForm
