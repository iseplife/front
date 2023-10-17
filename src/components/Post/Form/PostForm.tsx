import React, {useCallback, useContext, useEffect, useRef} from "react"
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
import { AppContext } from "../../../context/app/context"
import Textarea from "react-expanding-textarea"

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
    const {state: {user}} = useContext(AppContext)

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
            switch(type){
                case EmbedEnumType.IMAGE:
                    if (files.length > 5) {
                        setFieldError("embed", "Vous ne pouvez pas publier plus de 5 photos")
                        return false
                    }
                    setFieldValue("embed", {type, data: files.map(f => ({file: f, nsfw: false}))} as EmbedCreation)
                    break
                case EmbedEnumType.DOCUMENT:
                    setFieldValue("embed", {
                        type: EmbedEnumType.DOCUMENT,
                        data: {file, nsfw: false}
                    })
                    break
                default:
                    setFieldValue("embed", {type, data: [{file: files[0], nsfw: false}]} as EmbedCreation)
                    break
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

    const changeAuthor = useCallback((author?: Author) => setValues({...values, selectedClub: author}), [values, setValues])

    return (
        <Form className={`flex flex-col items-center text-gray-500 ${!values.edit && "pt-6"}`}>
            <div className="flex flex-col bg-white rounded-lg w-full sm:w-11/12 pt-3" style={{minHeight: "5rem"}}>
                <Field
                    as={Textarea}
                    autoFocus={true}
                    name="description"
                    maxLength={3000}
                    placeholder={`${t("post:whatsup")}, ${user.firstName} ?`}
                    className={`px-1 text-base text-gray-800 mb-4 bg-transparent resize-none focus:outline-none ${values.edit ? "max-h-[calc(80vh-300px)]" : "max-h-[calc(80vh-200px)]"} min-h-[35px]`}
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
                                <Upload
                                    className="flex w-10 h-10 justify-center items-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer group"
                                    showUploadList={false}
                                    multiple
                                    beforeUpload={handleFile(EmbedEnumType.IMAGE)}
                                    accept=".png,.jpg,.jpeg,.gif"
                                >
                                    <FontAwesomeIcon icon={faImages} className="text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors text-xl"/>
                                </Upload>
                                <Upload
                                    className="flex w-10 h-10 justify-center items-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer group"
                                    showUploadList={false}
                                    beforeUpload={handleFile(EmbedEnumType.VIDEO)}
                                    accept=".mp4,.webm"
                                >
                                    <FontAwesomeIcon icon={faVideo} className="text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors text-xl"/>
                                </Upload>
                                <Upload
                                    className="flex w-10 h-10 justify-center items-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer group"
                                    showUploadList={false}
                                    beforeUpload={handleFile(EmbedEnumType.DOCUMENT)}
                                >
                                    <FontAwesomeIcon icon={faPaperclip} className="text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors text-xl"/>
                                </Upload>
                                <div
                                    className="flex w-10 h-10 justify-center items-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer group"
                                    onClick={() => setFieldValue("embed", DEFAULT_EMBED[EmbedEnumType.POLL])}
                                >
                                    <FontAwesomeIcon icon={faChartBar} className="text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors text-xl"/>
                                </div>
                            </div>
                        )
                    }
                </div>
                <Divider type="horizontal" className="mt-2 mb-4"/>
                <div className="flex">
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
                    <div className="flex-1 flex justify-end items-center">
                        {!values.edit && <>
                            <AuthorPicker
                                callback={changeAuthor} 
                                className="text-gray-700 rounded hover:bg-gray-100"
                            />
                            <Divider type="vertical" />
                        </>}
                        <button
                            type="submit"
                            disabled={isSubmitting || !values.description.length}
                            className={(values.description.length ? "cursor-pointer hover:bg-gray-100" : "cursor-default text-gray-300") + " text-xl rounded-full h-10 w-10 justify-center items-center flex pr-0.5 -m-1.5 -ml-0.5 transition-colors"}
                        >
                            <FontAwesomeIcon icon={isSubmitting ? faCircleNotch : faPaperPlane} spin={isSubmitting} />
                        </button>
                    </div>
                </div>
            </div>
        </Form>
    )
}

export default PostForm
