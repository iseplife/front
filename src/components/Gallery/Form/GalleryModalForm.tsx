import React, {useState} from "react"
import {Button, Modal} from "antd"
import GalleryForm from "./GalleryForm"
import {IconFA} from "../../Common/IconFA"
import {useTranslation} from "react-i18next"

type GalleryModalFormProps = {
    feed: number
}
const GalleryModalForm: React.FC<GalleryModalFormProps> = ({feed}) => {
    const {t} = useTranslation("gallery")
    const [visible, setVisible] = useState(false)
    return (
        <>
            <Button type="default" className="rounded" onClick={() => setVisible(true)}>
                {t("add")} <IconFA className="ml-2" name="fa-images" type="regular" />
            </Button>
            <Modal
                className="w-11/12 no-padding-modal"
                visible={visible}
                title={null}
                footer={null}
                onCancel={() => setVisible(false)}
            >
                <GalleryForm feed={feed}/>
            </Modal>
        </>
    )
}

export default GalleryModalForm