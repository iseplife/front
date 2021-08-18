import React from "react"
import {useFormikContext} from "formik"
import {PostFormValues} from "../PostForm"
import {EmbedEnumType, EmbedForm as EmbedFormType} from "../../../../data/post/types"
import ImageForm from "./ImageForm"
import PollForm from "./PollForm"
import DocumentForm from "./DocumentForm"
import VideoForm from "./VideoForm"

const EmbedForm: React.FC = () => {
    const {values: {embed}} = useFormikContext<PostFormValues<EmbedFormType>>()
    switch (embed?.type) {
        case EmbedEnumType.GALLERY:
            return <h3>Edition of a gallery is not possible from a post</h3>
        case EmbedEnumType.POLL:
            return <PollForm/>
        case EmbedEnumType.VIDEO:
            return <VideoForm/>
        case EmbedEnumType.DOCUMENT:
            return <DocumentForm />
        case EmbedEnumType.IMAGE:
            return <ImageForm />
        default:
            return null
    }
}

export default EmbedForm
