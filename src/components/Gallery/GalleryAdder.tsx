import React, {useCallback, useState} from "react"
import {Button, message, Modal, Upload} from "antd"
import {IconFA} from "../Common/IconFA"
import {useTranslation} from "react-i18next"
import {isFileImage} from "../../util"
import {createMedia} from "../../data/media"
import axios, {AxiosPromise} from "axios"
import {Image, Media} from "../../data/media/types"
import {addGalleryImages} from "../../data/gallery"
import {UploadFile} from "antd/es/upload/interface"

type GalleryAdderProps = {
    gallery: number
    club: number
    afterUpload: (images: Image[]) => void
}
const GalleryAdder: React.FC<GalleryAdderProps> = ({gallery, afterUpload, club}) => {
    const {t} = useTranslation("gallery")
    const [files, setFiles] = useState<File[]>([])
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [visible, setVisible] = useState<boolean>(false)
    const [uploading, setUploading] = useState<boolean>(false)

    const handleFiles = useCallback((file: File) => {
        if (isFileImage(file))
            setFiles(prevState => [...prevState, file])
        return false
    }, [gallery])

    const uploadImages = useCallback(() => {
        setUploading(true)
        const requests: AxiosPromise<Media>[] = []
        files.forEach(f => {
            requests.push(
                createMedia(
                    f,
                    club,
                    true,
                    false,
                    (e) => setFileList(list => list.map(file => file.fileName === f.name ?
                        {...file, percent: Math.round(e.loaded * 100 / e.total)}:
                        file
                    ))
                )
            )
        })

        axios.all(requests)
            .then(axios.spread((...res) => {
                addGalleryImages(gallery, res.map(r => r.data.id)).then(res => {
                    message.success(t("upload_success"))
                    setVisible(false)
                })

                afterUpload(res.map(r => r.data as Image))
            }))
            .catch(e => message.error(t("upload_failed"), e))
            .finally(() => setUploading(false))
    }, [files, gallery])

    return (
        <div>
            <Button className="rounded mx-1" onClick={() => setVisible(true)}>
                {t("add_img")}
            </Button>
            <Modal
                visible={visible}
                onCancel={() => setVisible(false)}
                title={null}
                footer={null}
            >
                <div className="flex flex-col items-center p-1">
                    <Upload
                        multiple
                        beforeUpload={handleFiles}
                        fileList={fileList}
                        onChange={({fileList}) => setFileList(fileList.filter(f => isFileImage(f)))}
                        className="flex flex-col items-center"
                    >
                        <Button>
                            {t("select_img")}
                            <IconFA name="fa-file-upload" className="ml-2"/>
                        </Button>
                    </Upload>
                    {files.length > 0 &&
                    <>
                        <Button type="primary" className="rounded mt-5" onClick={uploadImages} disabled={uploading}>
                            {t("add_img")}
                        </Button>
                    </>
                    }
                </div>
            </Modal>
        </div>
    )
}

export default GalleryAdder