import React, { useContext, useEffect, useRef, useState } from "react"
import {BasicPostCreation, PostUpdate} from "../../../data/post/types"
import {Field, Form, FormikErrors, FormikProps, withFormik} from "formik"
import {Divider, message} from "antd"
import {createPost} from "../../../data/post"
import {faCircleNotch, faPaperPlane} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { useTranslation } from "react-i18next"
import { AppContext } from "../../../context/app/context"
import { Author } from "../../../data/request.type"
import { LoggedStudentPreview } from "../../../data/student/types"
import AuthorPicker from "../../Common/AuthorPicker"


export type BasicPostFormValues = {
    description: string
    private: boolean
    feed: number
    linkedClub?: number
    selectedClub?: Author
    setText: (value: string) => void
}


const InnerForm: React.FC<FormikProps<BasicPostFormValues> & {children: React.ReactNode}> = ({ children, isSubmitting, setValues, values }) => {
    const {t} = useTranslation(["post"])
    const {state: {user}} = useContext(AppContext)
    const textRef = useRef<HTMLInputElement>(null)
    const [selectedClub, setSelectedClub] = useState<Author>()

    useEffect(() => {
        if(values.selectedClub != selectedClub)
            setValues(values => ({...values, selectedClub}))
    }, [selectedClub, values.selectedClub])

    useEffect(() => {
        values.setText(values.description)
    }, [textRef?.current, values.setText, values.description])

    return (
        <Form className="flex flex-col items-center text-gray-500 rounded-lg shadow bg-white">
            <div className="flex flex-col w-full py-3 px-4 overflow-y-auto" style={{ minHeight: "5rem" }}>
                <Field
                    name="description"
                    placeholder={`${t("post:whatsup")}, ${user.firstName} ?`}
                    className="text-gray-700 placeholder-gray-500 flex-1 mb-4 resize-none focus:outline-none bg-black bg-opacity-5 rounded-full px-3 py-1.5"
                />


                <div className="flex justify-between text-xl -mt-2 mb-1">
                    {children}
                    <div className="flex-1 flex justify-end items-center mt-1 -mb-1">
                        <AuthorPicker
                            callback={setSelectedClub}
                            className="text-gray-700 rounded-lg hover:bg-gray-100 transition-colors py-1 mt-1"
                        />
                        <Divider type="vertical" className="mr-3 ml-2 mt-0.5 -mb-0.5" />
                    </div>
                    <div className="flex items-center">
                        <button
                            type="submit"
                            disabled={isSubmitting || !values.description.length}
                            className={(values.description.length ? "cursor-pointer hover:bg-gray-100" : "cursor-default text-gray-300") + " rounded-full h-10 w-10 justify-center items-center flex pr-0.5 -m-1.5 mt-1 transition-colors"}
                        >
                            <FontAwesomeIcon icon={isSubmitting ? faCircleNotch : faPaperPlane} spin={isSubmitting} />
                        </button>
                    </div>
                </div>
            </div>
        </Form>
    )
}


type BasicPostForm = {
    feed?: number
    onPost: (post: PostUpdate) => void
    setText: (value: string) => void
    user: LoggedStudentPreview
    children?: React.ReactNode
}
const BasicPostForm = withFormik<BasicPostForm, BasicPostFormValues>({
    mapPropsToValues: (props) => {
        return {
            description: "",
            feed: props.feed!,
            setText: props.setText,
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


    handleSubmit: async (values, { props, resetForm }) => {
        values.feed = values.feed ?? props.feed ?? values.selectedClub?.feedId ?? props.user.feedId
        values.linkedClub = values.selectedClub?.id
        const res = await createPost(values as BasicPostCreation)

        if (res.status === 200) {
            props.onPost(res.data)
            resetForm({})
            message.success("Post publié !")
        }
    },
})(InnerForm)


export default BasicPostForm
