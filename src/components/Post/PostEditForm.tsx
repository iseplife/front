import {PostUpdate} from "../../data/post/types"
import React from "react"
import {useTranslation} from "react-i18next"
import {Field, Form, FormikErrors, FormikProps,  withFormik} from "formik"
import {format} from "date-fns"
import {IconFA} from "../Common/IconFA"

type PostEditFormProps = {
    isPrivate: boolean
    publicationDate: Date
    description: string
    onClose: () => void
    onUpdate: (updates: PostUpdate) => void
}


type FormValues = {
    publicationDate: Date,
    description: string
    private: boolean
}
const EditForm: React.FC<FormikProps<FormValues>> = ({isSubmitting, setFieldValue, setValues, values, setFieldError}) => {
    const {t} = useTranslation()

    return (
        <Form>
            <div className="flex flex-row justify-end items-center">
                <div className="mx-2">
                    <span className="mx-2 text-xs">{t("published_at")} </span>
                    <input
                        type="time" name="publication-time"
                        defaultValue={format(values.publicationDate, "HH:mm")}
                        onChange={(e) => {
                            const val = e.target.valueAsDate
                            if (val) {
                                values.publicationDate.setHours(val.getHours())
                                values.publicationDate.setMinutes(val.getMinutes())
                            }
                        }}
                    />
                    <input
                        type="date" name="publication-date"
                        defaultValue={format(values.publicationDate, "yyyy-MM-dd")}
                        onChange={(e) => {
                            const val = e.target.valueAsDate
                            if (val) {
                                values.publicationDate.setFullYear(val.getFullYear())
                                values.publicationDate.setMonth(val.getMonth())
                                values.publicationDate.setDate(val.getDate())
                            }
                        }}
                    />
                </div>

                <div>
                    {values.private ?
                        <IconFA name="fa-lock" onClick={() => setFieldValue("private",false)}/> :
                        <IconFA name="fa-lock-open" onClick={() => setFieldValue("private", true)}/>
                    }
                </div>
            </div>
            <div>
                <Field
                    type="textarea"
                    name="description"
                    placeholder="What's on your mind ?"
                    className="text-gray-800 w-full resize-none"
                />

                {/*<Embed embed={po}/>*/}
            </div>
            <div className="text-right">
                <button className="px-2 py-1 mx-1 rounded bg-green-500 text-white hover:bg-green-700" type="submit">
                    {t("save")}
                </button>
                <button
                    className="px-2 py-1 mr-3 rounded bg-red-500 text-white hover:bg-red-700" type="button"
                    onClick={() => console.log("exit")}
                >
                    {t("cancel")}
                </button>
            </div>
        </Form>
    )
}

const PostEditForm = withFormik<PostEditFormProps, FormValues>({
    mapPropsToValues: (props) => {
        return {
            publicationDate: props.publicationDate,
            description: props.description,
            private: props.isPrivate
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
        console.log("submit ")

    },
})(EditForm)

export default PostEditForm
