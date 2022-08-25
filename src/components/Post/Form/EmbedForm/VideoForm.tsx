import React, {useCallback, useMemo, useState} from "react"
import {useFormikContext} from "formik"
import {PostFormValues} from "../PostForm"
import {
    ACCEPTED_FILETYPE,
    EmbedCreation,
    EmbedEnumType,
    EmbedForm,
    EmbedMediaCreation,
    EmbedMediaEdition
} from "../../../../data/post/types"
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Upload } from "antd"
import { useTranslation } from "react-i18next"


const VideoForm: React.FC = () => {
    const {setFieldValue, values} = useFormikContext<PostFormValues<EmbedForm>>()
    const [notEditable, setNotEditable] = useState(false)
    const {t} = useTranslation("post")
    const videoName = useMemo<string | undefined>(() => {
        if ((values.embed as EmbedMediaCreation | EmbedMediaEdition).data.length != 0) {
            const video = (values.embed as EmbedMediaCreation | EmbedMediaEdition).data[0]
            if(!video){
                setNotEditable(true)
                return
            }
            if("id" in video){
                return "video 1"
            } else {
                return (video.file as File).name
            }
        }
        return undefined
    }, [values.embed])

    const handleUpload = useCallback((file: File) => {
        setFieldValue("embed", {type: EmbedEnumType.VIDEO, data: [{file, nsfw: false}]} as EmbedCreation)
        return false
    }, [])

    return (
        <div className="flex items-center overflow-hidden ">
            {notEditable ?
                <div className="font-bold">{t("video_not_editable")}</div>
                :
                videoName ?
                    <span
                        className="cursor-pointer hover:text-red-400 "
                        onClick={() => setFieldValue("embed", undefined)}
                    >
                        {videoName}
                        <FontAwesomeIcon
                            icon={faTrashAlt}
                            size="lg"
                            className="mx-1 px-1 "
                        />
                    </span> :
                    <Upload
                        accept={ACCEPTED_FILETYPE[EmbedEnumType.VIDEO]}
                        beforeUpload={handleUpload}
                        maxCount={1}
                        className="rounded-md border py-1 px-2"
                    >
                        <span className="text-gray-500">Ajouter une vidéo +</span>
                    </Upload>
            }
        </div>
    )
}

export default VideoForm
