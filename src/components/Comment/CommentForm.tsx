import React, {createRef, useEffect, useState} from "react"
import { useFormik} from "formik"
import {useTranslation} from "react-i18next"
import {CommentForm as CommentFormType} from "../../data/thread/types"
import {faCircleNotch, faPaperPlane} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import AuthorPicker from "../Common/AuthorPicker"
import Textarea from "react-expanding-textarea"

interface CommentFormProps {
    handleUpload: (comment: CommentFormType) => Promise<void>
    focus?: boolean
    lightboxView: boolean | undefined
}

const CommentForm: React.FC<CommentFormProps> = ({handleUpload, focus, lightboxView}) => {
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
        onSubmit: (comment, { resetForm }) => {
            if (comment.message.split("").filter(letter => letter != " " && letter != "\t").length > 3) {
                setSubmitting(true)
                handleUpload(comment).then(() => {
                    resetForm({})
                }).finally(() => setSubmitting(false))
            }
        },
    })

    return (
        <form onSubmit={formik.handleSubmit} className="rounded-full border border-solid border-gray-300 flex px-2 py-1 my-3">
            <AuthorPicker callback={(author => formik.setFieldValue("asClub", author?.id))} compact className="h-7 -ml-2 -mr-1"/>
            <Textarea
                id="message"
                placeholder={t("write_comment")}
                maxLength={2000}
                className={`message border-none flex-1 bg-transparent w-full focus:outline-none ${lightboxView ? "text-white md:text-neutral-800" : "text-neutral-800"}`}
                onChange={formik.handleChange}
                value={formik.values.message}
                ref={inputRef}
            />

            <button type="submit" className="cursor-pointer text-gray-500 hover:text-gray-700 px-2 self-end mb-1.5" disabled={isSubmitting}>
                <FontAwesomeIcon icon={isSubmitting ? faCircleNotch : faPaperPlane} spin={isSubmitting}/>
            </button>
        </form>
    )
}

export default CommentForm
