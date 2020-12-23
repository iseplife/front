import React, {useCallback, useState} from "react"
import {IconFA} from "../Common/IconFA"
import {EmbedCreation, EmbedEnumType, EmbedPollCreation, Post, PostCreation} from "../../data/post/types"
import {Field, Form, FormikErrors, FormikProps, withFormik} from "formik"
import {Divider, message, Upload} from "antd"
import AvatarPicker from "../Common/AvatarPicker"
import {createPost} from "../../data/post"
import EmbedForm, {FileStore} from "./EmbedForm"
import {createMedia} from "../../data/media"
import {createGallery} from "../../data/gallery"
import {createPoll} from "../../data/poll"
import {AxiosResponse} from "axios"

export type FormValues = {
    description: string
    private: boolean
    draft: boolean
    feed: number
    linkedClub?: number
    embed?: EmbedCreation
}
const InnerForm: React.FC<FormikProps<FormValues>> = ({isSubmitting, setFieldValue, setValues, values, errors, setFieldError}) => {
    const [fileStore, setFileStore] = useState<FileStore>([])

    const handleFile = useCallback((type: EmbedEnumType) => (file: File, files: File[]) => {
        if (type === EmbedEnumType.IMAGE) {
            if (values.embed?.type !== type)
                setFileStore([])
            
            if (files.length > 5) {
                setFieldError("attachments", "Vous ne pouvez pas publier plus de 3 photos")
                return false
            }
            const reader = new FileReader()
            reader.onload = e => setFileStore(store => [
                ...store,
                {
                    file,
                    preview: reader.result as string
                }
            ])

            reader.readAsDataURL(file)
            setFieldValue("embed", {type, data: files})
        } else {
            setFileStore([{file}])
            setFieldValue("embed", {type, data: [file]})
        }
        return false
    }, [setFieldError, setFieldValue, values.embed?.type])

    return (
        <Form className="flex flex-col items-center text-gray-500">
            <div className="flex flex-col bg-white rounded-lg w-5/6 py-3 px-4 overflow-y-auto" style={{minHeight: "5rem"}}>
                <Field
                    type="textarea"
                    name="description"
                    placeholder="What's on your mind ?"
                    className="text-gray-800 flex-1 mb-4 bg-transparent resize-none focus:outline-none"
                />
                {values.embed && (
                    <EmbedForm files={fileStore} setFiles={setFileStore}/>
                )}
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <Upload showUploadList={false} multiple beforeUpload={handleFile(EmbedEnumType.IMAGE)} accept=".png,.jpg,.jpeg,.gif">
                            <IconFA name="fa-images" className="text-gray-500 cursor-pointer mx-1 hover:text-gray-700"/>
                        </Upload>
                        <Upload showUploadList={false} beforeUpload={handleFile(EmbedEnumType.VIDEO)} accept=".mp4,.webm">
                            <IconFA name="fa-video" type="solid" className="text-gray-500 cursor-pointer mx-1 hover:text-gray-700"/>
                        </Upload>
                        <Upload showUploadList={false} beforeUpload={handleFile(EmbedEnumType.DOCUMENT)}>
                            <IconFA name="fa-paperclip" type="solid" className="text-gray-500 cursor-pointer mx-1 hover:text-gray-700"/>
                        </Upload>
                        <div onClick={() => setFieldValue("embed", {
                            type: EmbedEnumType.POLL,
                            data: {
                                title: "",
                                choices: [""],
                                multiple: false,
                                anonymous: true
                            }
                        })}>
                            <IconFA name="fa-chart-bar" className="cursor-pointer mx-1 hover:text-gray-700"/>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-end items-center">
                        <AvatarPicker callback={(id) => setValues({...values, linkedClub: id})} className="mr-3 rounded hover:bg-gray-100"/>
                        <Divider type="vertical"/>
                    </div>
                    <div className="flex items-center">
                        <button
                            type="submit"
                            disabled={isSubmitting || !values.description.length}
                            className={values.description.length ? "cursor-pointer hover:text-gray-700" : "cursor-default text-gray-300"}
                        >
                            <IconFA name={isSubmitting ? "fa-circle-notch fa-spin" : "fa-paper-plane"} />
                        </button>
                    </div>
                </div>
            </div>
        </Form>
    )
}


type PostFormProps = {
    feedId: number
    onPost: (post: Post) => void
}
const PostForm = withFormik<PostFormProps, FormValues>({
    mapPropsToValues: (props) => {
        return {
            description: "",
            feed: props.feedId,
            private: true,
            draft: false
        }
    },

    validate: (values: FormValues) => {
        const errors: FormikErrors<any> = {}
        if (!values.description.length) {
            errors.description = "Required"
        }
        return errors
    },


    handleSubmit: async (values, {props, resetForm}) => {
        const {embed, ...post} = values
        if (embed) {
            let res: AxiosResponse<{id: number}>

            switch (embed.type) {
                case EmbedEnumType.IMAGE:
                    if (embed.data.length > 1 && embed.data.length < 6) {
                        const ids = []
                        for (const f of embed.data) {
                            const res = await createMedia(f)
                            ids.push(res.data.id)
                        }

                        res = await createGallery({
                            feed: props.feedId,
                            pseudo: true,
                            images: ids
                        })

                    } else {
                        res = await createMedia(embed.data[0])
                    }
                    break
                case EmbedEnumType.DOCUMENT:
                case EmbedEnumType.VIDEO:
                    res = await createMedia(embed.data[0])
                    break
                case EmbedEnumType.GALLERY:
                    console.log("oui")
                    break
                case EmbedEnumType.POLL:
                    res = await createPoll((values.embed as EmbedPollCreation).data)
                    break
            }

            if (embed.type === EmbedEnumType.IMAGE && embed.data.length > 1) {
                (post as PostCreation).attachements = {[EmbedEnumType.GALLERY]: res!.data.id}
            } else {
                (post as PostCreation).attachements = {[embed.type]: res!.data.id}
            }

        }

        const res = await createPost(post as PostCreation)
        if (res.status === 200) {
            props.onPost(res.data)
            resetForm({})
            message.success("Post publié !")
        }
    },
})(InnerForm)


export default PostForm