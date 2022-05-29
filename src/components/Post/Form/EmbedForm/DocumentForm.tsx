import React, {useCallback} from "react"
import {useFormikContext} from "formik"
import {PostFormValues} from "../PostForm"
import {Upload} from "antd"
import {
    ACCEPTED_FILETYPE, DEFAULT_EMBED,
    EmbedDocumentCreation, EmbedDocumentEdition,
    EmbedEnumType,
    EmbedForm
} from "../../../../data/post/types"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons"
import {DocumentCreation, DocumentEdition} from "../../../../data/media/types"


const DocumentForm: React.FC = () => {
    const {setFieldValue, values} = useFormikContext<PostFormValues<EmbedForm>>()
    const document = (values.embed as EmbedDocumentCreation | EmbedDocumentEdition).data

    const handleUpload = useCallback((file: File) => {
        setFieldValue("embed", {
            type: EmbedEnumType.DOCUMENT,
            data: {file, nsfw: false}
        })
        return false
    }, [])

    return (
        <div className="flex items-center">
            {document.file ?
                <span>
                    {document.file instanceof File ?
                        (document as DocumentCreation).file.name:
                        (document as DocumentEdition).title
                    }
                    <FontAwesomeIcon
                        icon={faTrashAlt}
                        className="mx-1 px-1 text-gray-300 hover:text-red-400 cursor-pointer"
                        onClick={() => setFieldValue("embed", DEFAULT_EMBED[EmbedEnumType.DOCUMENT])}
                    />
                </span> :
                <Upload
                    accept={ACCEPTED_FILETYPE[EmbedEnumType.DOCUMENT]}
                    beforeUpload={handleUpload}
                    className="rounded-md border py-1 px-2"
                >
                    <span className="text-gray-500">Ajouter un document +</span>
                </Upload>
            }
        </div>
    )
}

export default DocumentForm
