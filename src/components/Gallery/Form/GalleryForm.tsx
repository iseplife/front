import React, {useCallback, useMemo, useState, useContext} from "react"
import {useFormik} from "formik"
import {GalleryPreview, OfficialGalleryForm} from "../../../data/gallery/types"
import {Input, message, Switch} from "antd"
import {useTranslation} from "react-i18next"
import GalleryDragger from "./GalleryDragger"
import {createGallery} from "../../../data/gallery"
import HelperIcon from "../../Common/HelperIcon"
import AuthorPicker from "../../Common/AuthorPicker"
import { AppContext, AppContextType } from "../../../context/app/context"

const {TextArea} = Input

type GalleryFormProps = {
    feed: number
    clubsAllowedToPublishGallery?: number[]
    onSubmit: (g: GalleryPreview) => void
}
const GalleryForm: React.FC<GalleryFormProps> = ({feed, clubsAllowedToPublishGallery, onSubmit}) => {

    const [uploading, setOnUploading] = useState(false)

    const {t} = useTranslation("gallery")

    const {state: {authors}} = useContext<AppContextType>(AppContext)
    
    const formik = useFormik<OfficialGalleryForm>({
        initialValues: {
            name: "",
            description: "",
            images: [],
            pseudo: false,
            generatePost: true,
            feed: feed,
            club: authors.find(author => clubsAllowedToPublishGallery?.includes(author.id))?.id ?? -1,
        },
        onSubmit: (values) => {
            console.log("submit here")
            createGallery(values).then(res => {
                message.success(t("created"))
                onSubmit({
                    id: res.data.id,
                    name: res.data.name,
                    preview: res.data.images.splice(0, 5)
                })
            })
        }
    })

    const onFilesUploaded = useCallback((ids: number[]) => {
        formik.values.images = ids
        formik.submitForm()
    }, [formik])
    
    const isFormValid = useMemo(() => (
        formik.values.name.length > 3 && (formik.values.description.length > 3 || !formik.values.generatePost) && formik.values.club != -1
    ), [formik.values.name, formik.values.description, formik.values.generatePost, formik.values.club])

    return (
        <form className="flex flex-col lg:flex-row h-full " onSubmit={formik.handleSubmit}>
            <div className="flex flex-col w-full lg:w-1/4 bg-gray-100 p-4 rounded-l">
                <div className="mr-12 lg:mr-0">
                    <div className="ant-divider ant-divider-horizontal ant-divider-with-text ant-divider-with-text-left text-gray-700 text-lg my-1" role="separator">
                        <span className="ant-divider-inner-text">{t("form.title")}</span>
                    </div>
                </div>

                
                
                <div className="flex flex-col sm:flex-row lg:flex-col w-full lg:h-full px-4 my-4">

                    <div className="px-4 lg:px-0">
                        <div className="mt-4">
                            <label >{t("form.name")}</label>
                            <Input
                                name="name"
                                placeholder="Nom de la galerie"
                                required
                                className="rounded bg-white"
                                bordered={false}
                                style={{border: "1px solid #e2e8f0"}}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                disabled={uploading}
                            />
                        </div>

                        {formik.values.generatePost ? <div className="mt-4">
                            <label >{t("form.description")}</label>
                            <TextArea
                                name="description"
                                placeholder="Description de la galerie"
                                required
                                className="rounded bg-white max-h-[230px]"
                                bordered={false}
                                style={{border: "1px solid #e2e8f0"}}
                                rows={5}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                disabled={uploading}
                            />
                        </div> : undefined }
                    </div>

                    <div className="p-4 lg:p-0 flex flex-col h-full">
                        <div className="mt-4 pr-1 flex justify-between">
                            <label className="mr-2">
                                {t("form.generate_post")}
                                <HelperIcon text={t("form.generate_post_help")}/>
                            </label>
                            <Switch
                                checked={formik.values.generatePost}
                                onChange={val => formik.setFieldValue("generatePost", val)}
                                disabled={uploading}
                            />
                        </div>
                        <div className="flex-grow flex flex-col justify-end">
                            <label >{t("form.author")}</label>
                            <AuthorPicker
                                className="max-w-full w-64 hover:border-indigo-400"
                                style={{borderBottom: "1px solid #e2e8f0"}}
                                clubOnly={true}
                                filter={clubsAllowedToPublishGallery}
                                callback={author => formik.setFieldValue("club", author?.id || -1)}
                                defaultValue={formik.initialValues.club}
                            />
                        </div>
                    </div>
                   
                  
                </div>
               
            </div>
            <div className="w-full lg:w-3/4">
                <GalleryDragger club={formik.values.club} canSubmit={isFormValid} afterSubmit={onFilesUploaded} onUploading={() => setOnUploading(true)}/>
            </div>
        </form>
    )
}

export default GalleryForm
