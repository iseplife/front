import React, {useCallback, useEffect, useRef} from "react"
import {ACCEPTED_FILETYPE, DEFAULT_EMBED, EmbedCreation, EmbedEnumType, EmbedForm as EmbedFormType,} from "../../../data/post/types"
import {Field, Form, FormikProps,} from "formik"
import {DatePicker, Divider, Upload} from "antd"
import EmbedForm from "./EmbedForm"
import moment from "moment"
import {isFuture, isPast} from "date-fns"
import {useTranslation} from "react-i18next"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {
    faChartBar,
    faCircleNotch,
    faImages,
    faPaperclip, faPaperPlane,
    faVideo
} from "@fortawesome/free-solid-svg-icons"
import { Author } from "../../../data/request.type"
import AuthorPicker from "../../Common/AuthorPicker"
import { useMemo } from "react"

export type PostFormValues<T extends EmbedFormType> = {
    id?: number
    description: string
    embed?: T
    publicationDate: Date
    linkedClub?: number
    selectedClub?: Author
    text?: string
    edit?: boolean
}
const PostForm: React.FC<FormikProps<PostFormValues<EmbedFormType>>> = ({isSubmitting, setFieldValue, setValues, values, setFieldError}) => {
    const {t} = useTranslation("post")
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // We trigger upload window only if it a creation's form and the embed chose isn't a poll
        if (inputRef && inputRef.current && values.id == undefined && values.embed && values.embed.type != EmbedEnumType.POLL)
            inputRef.current.click()
    }, [])

    useEffect(() => {
        if(values.text)
            setValues(values => ({...values, description: values.text ?? ""}))
    }, [values.text])


    const handleFile = useCallback((type: EmbedEnumType) => (file: File, files: File[]) => {
        if (files.length > 0) {
            if (type === EmbedEnumType.IMAGE) {
                if (files.length > 5) {
                    setFieldError("embed", "Vous ne pouvez pas publier plus de 5 photos")
                    return false
                }
                setFieldValue("embed", {type, data: files.map(f => ({file: f, nsfw: false}))} as EmbedCreation)
            } else {
                setFieldValue("embed", {type, data: [{file: files[0], nsfw: false}]} as EmbedCreation)
            }
        }
        return false
    }, [setFieldError, setFieldValue, values.embed?.type])

    const handleInputFile = useCallback((type: EmbedEnumType) => (e: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        const files: File[] = e.target.files ? [...e.target.files] : []
        handleFile(type)(files[0], files)
    }, [handleFile])

    const originalPublicationDate = useMemo(() => values.publicationDate, [])

    return (
        <Form className="flex flex-col items-center text-gray-500">
            <div className="flex flex-col bg-white rounded-lg w-5/6 py-3 overflow-y-auto" style={{minHeight: "5rem"}}>
                {(!values.edit || isFuture(originalPublicationDate)) && <div className="flex justify-between items-center mb-2">
                    <DatePicker
                        format="DD/MM/YYYY HH:mm"
                        showTime
                        defaultValue={moment()}
                        value={moment(values.publicationDate)}
                        disabledDate={c => isPast(c.toDate())}
                        onChange={date => setFieldValue("publicationDate", date!.toDate())}
                        bordered={false}
                        placeholder={t("publication_date")}
                        className="hover:border-indigo-400 text-gray-500 border-gray-200"
                        style={{borderBottom: "1px solid #d9d9d9"}}
                    />
                </div>}

                <Field
                    as="textarea"
                    name="description"
                    placeholder="What's on your mind ?"
                    className="text-gray-800 flex-1 mb-4 bg-transparent resize-none focus:outline-none border-b"
                />

                <div className="flex justify-between">
                    {values.embed ? 
                        (
                            <>
                                <EmbedForm/>
                                <input
                                    type="file" ref={inputRef}
                                    hidden
                                    multiple={values.embed.type === EmbedEnumType.IMAGE}
                                    accept={ACCEPTED_FILETYPE[values.embed.type]}
                                    onChange={handleInputFile(values.embed.type)}
                                />
                            </>
                        ) : (
                            <div className="flex items-center">
                                <Upload showUploadList={false} multiple beforeUpload={handleFile(EmbedEnumType.IMAGE)} accept=".png,.jpg,.jpeg,.gif">
                                    <FontAwesomeIcon icon={faImages} className="text-gray-500 cursor-pointer mx-1 hover:text-gray-700"/>
                                </Upload>
                                <Upload showUploadList={false} beforeUpload={handleFile(EmbedEnumType.VIDEO)} accept=".mp4,.webm">
                                    <FontAwesomeIcon icon={faVideo} className="text-gray-500 cursor-pointer mx-1 hover:text-gray-700"/>
                                </Upload>
                                <Upload showUploadList={false} beforeUpload={handleFile(EmbedEnumType.DOCUMENT)}>
                                    <FontAwesomeIcon icon={faPaperclip} className="text-gray-500 cursor-pointer mx-1 hover:text-gray-700"/>
                                </Upload>
                                <div onClick={() => setFieldValue("embed", DEFAULT_EMBED[EmbedEnumType.POLL])}>
                                    <FontAwesomeIcon icon={faChartBar} className="text-gray-500 cursor-pointer mx-1 hover:text-gray-700"/>
                                </div>
                            </div>
                        )
                    }
                    {!values.edit && <div className="flex-1 flex justify-end items-center">
                        <AuthorPicker
                            callback={author => setValues({...values, selectedClub: author})} 
                            className="mr-3 text-gray-700 rounded hover:bg-gray-100"
                        />
                        <Divider type="vertical"/>
                    </div>}
                    <div className="flex items-center">
                        <button
                            type="submit"
                            disabled={isSubmitting || !values.description.length}
                            className={values.description.length ? "cursor-pointer hover:text-gray-700" : "cursor-default text-gray-300"}
                        >
                            <FontAwesomeIcon icon={isSubmitting ? faCircleNotch: faPaperPlane} spin={isSubmitting}/>
                        </button>
                    </div>
                </div>
            </div>
        </Form>
    )
}

export default PostForm
