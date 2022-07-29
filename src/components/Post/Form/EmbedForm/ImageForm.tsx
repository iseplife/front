import React, {useCallback} from "react"
import PictureCard from "../../../Common/PictureCard"
import {useFormikContext} from "formik"
import {PostFormValues} from "../PostForm"
import {Upload} from "antd"
import {MediaEditionNSFW, MediaUploadNSFW} from "../../../../data/media/types"
import {ACCEPTED_FILETYPE, EmbedCreation, EmbedEnumType, EmbedForm, EmbedMediaCreation, EmbedMediaEdition} from "../../../../data/post/types"

import "./ReducedUploader.css"
import {useTranslation} from "react-i18next"
import {toggleMediaNSFW} from "../../../../data/media"
import {faPlus} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


const ImageForm: React.FC = () => {
    const {t} = useTranslation("post")
    const {setFieldValue, setFieldError, values} = useFormikContext<PostFormValues<EmbedForm>>()
    const images = (values.embed as EmbedMediaEdition | EmbedMediaCreation).data

    const handleDelete = useCallback((media: string | File) => {
        if (images.length - 1 === 0) {
            setFieldValue("embed", undefined)
        } else {
            setFieldValue("embed", {
                type: EmbedEnumType.IMAGE,
                data: images.filter((img) => img.file !== media)
            } as EmbedCreation)
        }
    }, [images])

    const handleUpload = useCallback((file: File, files: File[]) => {
        if (files.length + images.length > 5)
            setFieldError("embed", t("max_image_reached"))
        else
            setFieldValue("embed", {type: EmbedEnumType.IMAGE, data: [...images, {file, nsfw: false}]})
        return false
    }, [images])

    const toggleNSFW = useCallback((media: string | File) => {
        const index = images.findIndex(img => img.file === media)
        if ("id" in images[index]) {
            toggleMediaNSFW((images[index] as MediaEditionNSFW).id).then((isNSFW) => {
                setFieldValue("embed", {
                    type: EmbedEnumType.IMAGE,
                    data: (images as MediaEditionNSFW[]).map((img, i) => index === i ? {...img, nsfw: isNSFW} : img)
                })
            })
        } else {
            setFieldValue("embed", {
                type: EmbedEnumType.IMAGE,
                data: (images as MediaUploadNSFW[]).map((img, i) => index === i ? {...img, nsfw: !img.nsfw} : img)
            })
        }
    }, [images])

    return (
        <div className="flex">
            {(images as MediaUploadNSFW[]).map((f, i) =>
                <PictureCard
                    key={i}
                    file={f.file}
                    onDelete={handleDelete}
                    nsfw={f.nsfw}
                    toggleNsfw={toggleNSFW}
                    className="mx-2"
                />
            )}

            <Upload
                listType="picture-card"
                showUploadList={false}
                multiple
                accept={ACCEPTED_FILETYPE[EmbedEnumType.IMAGE]}
                beforeUpload={handleUpload}
            >
                {images.length >= 5 ?
                    null :
                    <div>
                        <FontAwesomeIcon icon={faPlus}/>
                        <div style={{marginTop: 8}}>Upload</div>
                    </div>
                }
            </Upload>
        </div>
    )
}
export default ImageForm
