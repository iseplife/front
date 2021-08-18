import React from "react"
import {BasicPostCreation, Post} from "../../../data/post/types"
import {Field, Form, FormikErrors, FormikProps, withFormik} from "formik"
import {Divider, message} from "antd"
import AvatarPicker from "../../Common/AvatarPicker"
import {createPost} from "../../../data/post"
import {faCircleNotch, faPaperPlane} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"


export type BasicPostFormValues = {
    description: string
    private: boolean
    feed: number
    linkedClub?: number
}


const InnerForm: React.FC<FormikProps<BasicPostFormValues>> = ({children, isSubmitting, setValues, values}) => (
    <Form className="flex flex-col items-center text-gray-500">
        <div className="flex flex-col bg-white rounded-lg w-5/6 py-3 px-4 overflow-y-auto" style={{minHeight: "5rem"}}>
            <Field
                type="textarea"
                name="description"
                placeholder="What's on your mind ?"
                className="text-gray-800 flex-1 mb-4 bg-transparent resize-none focus:outline-none"
            />


            <div className="flex justify-between">
                {children}
                <div className="flex-1 flex justify-end items-center">
                    <AvatarPicker
                        callback={(id) => setValues({...values, linkedClub: id})}
                        className="mr-3 text-gray-700 rounded hover:bg-gray-100"
                    />
                    <Divider type="vertical"/>
                </div>
                <div className="flex items-center">
                    <button
                        type="submit"
                        disabled={isSubmitting || !values.description.length}
                        className={values.description.length ? "cursor-pointer hover:text-gray-700" : "cursor-default text-gray-300"}
                    >
                        <FontAwesomeIcon icon={isSubmitting ? faCircleNotch: faPaperPlane} spin={isSubmitting} />
                    </button>
                </div>
            </div>
        </div>
    </Form>
)


type BasicPostForm = {
    feedId: number
    onPost: (post: Post) => void
}
const BasicPostForm = withFormik<BasicPostForm, BasicPostFormValues>({
    mapPropsToValues: (props) => {
        return {
            description: "",
            feed: props.feedId,
            private: true,
        }
    },

    validate: (values: BasicPostFormValues) => {
        const errors: FormikErrors<BasicPostFormValues> = {}
        if (!values.description.length) {
            errors.description = "Required"
        }
        return errors
    },


    handleSubmit: async (values, {props, resetForm}) => {
        const res = await createPost(values as BasicPostCreation)

        if (res.status === 200) {
            props.onPost(res.data)
            resetForm({})
            message.success("Post publié !")
        }
    },
})(InnerForm)


export default BasicPostForm
