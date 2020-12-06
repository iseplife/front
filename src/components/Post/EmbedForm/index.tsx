import React from "react"
import {useFormikContext} from "formik"
import {FormValues} from "../PostForm"
import {DeleteOutlined} from "@ant-design/icons"
import {EmbedEnumType} from "../../../data/post/types"
import ImageForm from "./ImageForm"
import PollForm from "./PollForm"
import {Modal} from "antd"

export type FileStore = {
    file: File,
    preview?: string
    nsfw?: boolean
}[]


type EmbedFormProps = {
    files: FileStore
    setFiles: React.Dispatch<React.SetStateAction<FileStore>>
}
const EmbedForm: React.FC<EmbedFormProps> = ({files, setFiles}) => {
    const {values: {embed}, setFieldValue} = useFormikContext<FormValues>()
    if (embed) {
        switch (embed.type) {
            case EmbedEnumType.GALLERY:
                return null
            case EmbedEnumType.POLL:
                return <PollForm />
            case EmbedEnumType.VIDEO:
            case EmbedEnumType.DOCUMENT:
                return (
                    <div className="flex items-center">
                        {files[0].file.name}
                        <DeleteOutlined
                            className="mx-1 px-1 hover:text-red-400"
                            onClick={() => {
                                setFiles([])
                                setFieldValue("embed", undefined)
                            }}
                        />
                    </div>
                )
            case EmbedEnumType.IMAGE:
                return <ImageForm files={files} setFiles={setFiles} />
        }
    }else {
        return null
    }
}

export default EmbedForm
