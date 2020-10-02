import React, {useCallback, useState} from "react"
import {Button, Modal} from "antd"
import GalleryForm from "./GalleryForm"
import {IconFA} from "../../Common/IconFA"
import {useTranslation} from "react-i18next"
import {GalleryPreview} from "../../../data/gallery/types"

type GalleryModalFormProps = {
    feed: number
    onSubmit: (g: GalleryPreview) => void
}
const GalleryModalForm: React.FC<GalleryModalFormProps> = ({feed, onSubmit}) => {
    const {t} = useTranslation("gallery")
    const [visible, setVisible] = useState(false)

    const handleSubmit = useCallback((g: GalleryPreview) => {
        setVisible(false)
        onSubmit(g)
    }, [onSubmit])
    return (
        <>
            <Button type="default" className="rounded text-gray-600" onClick={() => setVisible(true)}>
                {t("add")} <IconFA className="ml-2" name="fa-images" type="regular"/>
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