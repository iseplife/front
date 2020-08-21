import React, {useCallback, useMemo} from "react"
import {useFormik} from "formik"
import {Gallery, GalleryForm as GalleryFormType} from "../../../data/gallery/types"
import {Input, message} from "antd"
import {useTranslation} from "react-i18next"
import GalleryDragger from "./GalleryDragger"
import {createGallery} from "../../../data/gallery"
import AvatarPicker from "../../Common/AvatarPicker"

const {TextArea} = Input

type GalleryFormProps = {
    feed: number
    onSubmit: (g: Gallery) => void
}
const GalleryForm: React.FC<GalleryFormProps> = ({feed, onSubmit}) => {
    const {t} = useTranslation("gallery")
    const formik = useFormik<GalleryFormType>({
        initialValues: {
            name: "",
            description: "",
            images: [],
            feed: feed,
            club: -1,
        },
        onSubmit: (values) => {
            createGallery(values).then(res => {
                message.success(t("created"))
                onSubmit(res.data)
            })
        }
    })

    const onFilesUploaded = useCallback((ids) => {
        formik.setFieldValue("images", ids)
        formik.submitForm().then(r => console.log(r))
    }, [formik])
    const isFormValid = useMemo(() => (
        formik.values.name.length > 3 && formik.values.club != -1
    ), [formik.values.name, formik.values.club])

    return (
        <form className="flex" onSubmit={formik.handleSubmit} style={{height: "30rem", maxHeight: "90%"}}>
            <div className="flex flex-col w-1/4 bg-gray-100 p-4 rounded-l border-r-2">
                <div className="my-2">
                    <h1 className="text-gray-800 font-bold text-xl mb-6">{t("form.title")}</h1>

                    <label className="font-dinotcb">{t("form.name")}*</label>
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

                <div className="my-4">
                    <label className="font-dinotcb">{t("form.description")}</label>
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

                <div className="flex-grow flex flex-col justify-end">
                    <label className="font-dinotcb">{t("form.author")}</label>
                    <AvatarPicker
                        className="max-w-full w-64 hover:border-indigo-400"
                        style={{borderBottom: "1px solid #e2e8f0"}}
                        clubOnly={true}
                        callback={id => formik.setFieldValue("club", id || -1)}
                    />
                </div>
            </div>
            <div className="w-3/4 ">
                <GalleryDragger canSubmit={isFormValid} afterSubmit={onFilesUploaded}/>
            </div>
        </form>
    )
}

export default GalleryForm