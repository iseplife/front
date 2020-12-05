import {PostUpdate} from "../../data/post/types"
import React, {useState} from "react"
import {useTranslation} from "react-i18next"
import {useFormik} from "formik"
import {format} from "date-fns"
import {LockOutlined, UnlockOutlined} from "@ant-design/icons"

type PostEditFormProps = {
    isPrivate: boolean
    publicationDate: number
    description: string
    onClose: () => void
    onUpdate: (updates: PostUpdate) => void
}

const PostEditForm: React.FC<PostEditFormProps> = ({isPrivate, publicationDate, description, onClose, onUpdate}) => {
    const {t} = useTranslation()
    const [lockPost, setLockPost] = useState<boolean>(isPrivate)
    const formik = useFormik({
        initialValues: {
            private: isPrivate,
            publicationDate: new Date(publicationDate),
            description,
        },
        onSubmit: values => {
            onUpdate(values)
        },
    })

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-row justify-end items-center">
                <div className="mx-2">
                    <span className="mx-2 text-xs">{t("published_at")} </span>
                    <input
                        type="time" name="publication-time"
                        defaultValue={format(formik.values.publicationDate, "HH:mm")}
                        onChange={(e) => {
                            const val = e.target.valueAsDate
                            if (val) {
                                formik.values.publicationDate.setHours(val.getHours())
                                formik.values.publicationDate.setMinutes(val.getMinutes())
                            }
                        }}
                    />
                    <input
                        type="date" name="publication-date"
                        defaultValue={format(formik.values.publicationDate, "yyyy-MM-dd")}
                        onChange={(e) => {
                            const val = e.target.valueAsDate
                            if (val) {
                                formik.values.publicationDate.setFullYear(val.getFullYear())
                                formik.values.publicationDate.setMonth(val.getMonth())
                                formik.values.publicationDate.setDate(val.getDate())
                            }
                        }}
                    />
                </div>

                <div className="flex">
                    {lockPost
                        ? <LockOutlined onClick={() => setLockPost(false)}/>
                        : <UnlockOutlined onClick={() => setLockPost(true)}/>
                    }

                    <input
                        className="hidden"
                        name="private"
                        type="checkbox"
                        onChange={formik.handleChange}
                        checked={lockPost}
                    />
                </div>
            </div>
            <div>
                <textarea
                    name="description"
                    className="w-full resize-none"
                    autoFocus
                    onChange={formik.handleChange}
                    value={formik.values.description}
                />
                {/*<Embed embed={po}/>*/}
            </div>
            <div className="text-right">
                <button className="px-2 py-1 mx-1 rounded bg-green-500 text-white hover:bg-green-700" type="submit">
                    {t("save")}
                </button>
                <button
                    className="px-2 py-1 mr-3 rounded bg-red-500 text-white hover:bg-red-700" type="button"
                    onClick={onClose}
                >
                    {t("cancel")}
                </button>
            </div>
        </form>
    )
}

export default PostEditForm
