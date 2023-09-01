import React, {useCallback, useContext, useMemo} from "react"
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
        formik.values.images =  ids
        formik.submitForm()
    }, [formik])
    
    const isFormValid = useMemo(() => (
        formik.values.name.length > 3 && formik.values.club !== -1
    ), [formik.values.name, formik.values.club])

    return (
        <form className="flex" onSubmit={formik.handleSubmit} style={{height: "30rem", maxHeight: "90%"}}>
            <div className="flex flex-col w-1/4 bg-gray-100 p-4 rounded-l border-r-2">

                <div className="my-2">
                    <h1 className="text-gray-800 font-bold text-xl mb-6">{t("form.title")}</h1>

                    <label >{t("form.name")}*</label>
                    <Input
                        name="name"
                        required
                        className="rounded bg-white"
                        bordered={false}
                        style={{border: "1px solid #e2e8f0"}}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                </div>

                <div className="mt-4">
                    <label >{t("form.description")}</label>
                    <TextArea
                        name="description"
                        required
                        className="rounded bg-white"
                        bordered={false}
                        style={{border: "1px solid #e2e8f0"}}
                        rows={5}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                </div>
                <div className="mt-1 mb-2">
                    <label className="mr-2">
                        {t("form.generate_post")}
                        <HelperIcon text={t("form.generate_post_help")}/>
                    </label>
                    <Switch
                        checked={formik.values.generatePost}
                        onChange={val => formik.setFieldValue("generatePost", val)}
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
            <div className="w-3/4 ">
                <GalleryDragger club={formik.values.club} canSubmit={isFormValid} afterSubmit={onFilesUploaded}/>
            </div>
        </form>
    )
}

export default GalleryForm
