import React, {useState} from "react"
import {useFormik} from "formik"
import {IconFA} from "../Common/IconFA"
import {useTranslation} from "react-i18next"
import AvatarPicker from "../Common/AvatarPicker"
import {CommentForm as CommentFormType} from "../../data/thread/types"

interface CommentFormProps {
    handleUpload: (comment: CommentFormType) => Promise<void>
}
const CommentForm: React.FC<CommentFormProps> = ({handleUpload}) => {
    const {t} = useTranslation()
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const formik = useFormik<CommentFormType>({
        initialValues: {
            message: ""
        },
        onSubmit: (comment, {resetForm}) => {
            setSubmitting(true)
            handleUpload(comment).then(() => {
                setSubmitting(false)
                resetForm({})
            })
        },
    })

    return (
        <form onSubmit={formik.handleSubmit} className="rounded-full border border-solid border-gray-300 flex px-2 py-1 mt-3">
            <AvatarPicker callback={(id => formik.setFieldValue("asClub", id))} compact/>
            <input id="message"
                placeholder={t("write_comment")}
                className="message border-none flex-1 bg-transparent focus:outline-none"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.message}
            />
            <button type="submit" className="cursor-pointer text-gray-500 hover:text-gray-700 px-2" disabled={isSubmitting}>
                <IconFA name={isSubmitting ? "fa-circle-notch fa-spin" : "fa-paper-plane"}/>
            </button>
        </form>
    )
}

export default CommentForm