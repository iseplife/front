import React, {useCallback} from "react"
import {useFormikContext} from "formik"
import {PostFormValues} from "../PostForm"
import {Upload} from "antd"
import {ACCEPTED_FILETYPE, EmbedCreation, EmbedEnumType, EmbedForm, EmbedMediaCreation, EmbedMediaEdition} from "../../../../data/post/types"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons"


const DocumentForm: React.FC = () => {
    const {setFieldValue, values} = useFormikContext<PostFormValues<EmbedForm>>()
    const document = (values.embed as EmbedMediaCreation | EmbedMediaEdition).data

    const handleUpload = useCallback((file: File) => {
        setFieldValue("embed", {type: EmbedEnumType.DOCUMENT, data: [{file, nsfw: false}]} as EmbedCreation)
        return false
    }, [])

    return (
        <div className="flex items-center">
            {document.length == 0 ?
                <Upload
                    accept={ACCEPTED_FILETYPE[EmbedEnumType.DOCUMENT]}
                    beforeUpload={handleUpload}
                    className="rounded-md border py-1 px-2"
                >
                    <span className="text-gray-500">Ajouter un document +</span>
                </Upload> :
                <span>
                    Document
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                        className="mx-1 px-1 hover:text-red-400"
                        onClick={() => setFieldValue("embed", undefined)}
                    />
                </span>
            }
        </div>
    )
}

export default DocumentForm
