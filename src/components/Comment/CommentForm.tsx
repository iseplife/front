import React, {createRef, useEffect, useState} from "react"
import {useFormik} from "formik"
import {useTranslation} from "react-i18next"
import {CommentForm as CommentFormType} from "../../data/thread/types"
import {faCircleNotch, faPaperPlane} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import WrapperAuthorPicker from "../Post/WrapperAuthorPicker"

interface CommentFormProps {
    handleUpload: (comment: CommentFormType) => Promise<void>
    focus?: boolean
}

const CommentForm: React.FC<CommentFormProps> = ({handleUpload, focus}) => {
    const {t} = useTranslation()
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const inputRef = createRef<HTMLInputElement>()

    useEffect(() => {
        if (focus && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.scrollTo({behavior: "auto"})
        }
    }, [focus])

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
        <form onSubmit={formik.handleSubmit} className="rounded-full border border-solid border-gray-300 flex px-2 py-1 my-3">
            <WrapperAuthorPicker callback={(id => formik.setFieldValue("asClub", id))} compact className="h-7 -ml-2 -mr-1"/>
            <input
                id="message"
                placeholder={t("write_comment")}
                className="message border-none flex-1 bg-transparent focus:outline-none"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.message}
                ref={inputRef}
            />
            <button type="submit" className="cursor-pointer text-gray-500 hover:text-gray-700 px-2" disabled={isSubmitting}>
                <FontAwesomeIcon icon={isSubmitting ? faCircleNotch : faPaperPlane} spin={isSubmitting}/>
            </button>
        </form>
    )
}

export default CommentForm
