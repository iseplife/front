import React, {useCallback} from "react"
import {useFormikContext} from "formik"
import {PostFormValues} from "../PostForm"
import {Upload} from "antd"
import {ACCEPTED_FILETYPE, EmbedCreation, EmbedEnumType, EmbedForm, EmbedMediaCreation, EmbedMediaEdition} from "../../../../data/post/types"
import {IconFA} from "../../../Common/IconFA"


const VideoForm: React.FC = () => {
    const {setFieldValue, values} = useFormikContext<PostFormValues<EmbedForm>>()
    const video = (values.embed as EmbedMediaCreation | EmbedMediaEdition).data

    const handleUpload = useCallback((file: File) => {
        setFieldValue("embed", {type: EmbedEnumType.VIDEO, data: [{file, nsfw: false}]} as EmbedCreation)
        return false
    }, [])

    return (
        <div className="flex items-center">
            {video.length == 0 ?
                <Upload
                    accept={ACCEPTED_FILETYPE[EmbedEnumType.VIDEO]}
                    beforeUpload={handleUpload}
                    className="rounded-md border py-1 px-2"
                >
                    <span className="text-gray-500">Ajouter une vidéo +</span>
                </Upload> :
                <span>
                    <IconFA
                        name="fa-trash-alt"
                        type="regular"
                        className="mx-1 px-1 hover:text-red-400"
                        onClick={() => setFieldValue("embed", undefined)}
                    />
                </span>
            }
        </div>
    )
}

export default VideoForm
