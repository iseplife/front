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


const BasicPostForm: React.FC<BasicPostForm> = ({ children, onInputClicked}) => {
    const {t} = useTranslation(["post"])
    const {state: {user}} = useContext(AppContext)
    const [selectedClub, setSelectedClub] = useState<Author>()


    return (
        <div className="flex flex-col items-center text-gray-500 rounded-lg shadow bg-white">
            <div className="flex flex-col w-full py-3 px-4 overflow-y-auto" style={{ minHeight: "5rem" }}>
                <button
                    onClick={onInputClicked}
                    className="text-gray-500 text-left mb-4 resize-none focus:outline-none bg-black bg-opacity-5 hover:bg-opacity-[9%] transition-colors rounded-full px-3 py-1.5"
                >
                    {t("post:whatsup")}, {user.firstName} ?
                </button>


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
                           
                            className={("cursor-pointer hover:bg-gray-100") + " rounded-full h-10 w-10 justify-center items-center flex pr-0.5 -m-1.5 mt-1 transition-colors"}
                        >
                            <FontAwesomeIcon icon={faPaperPlane}  />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

type BasicPostForm = {
    feed?: number
    onPost: (post: PostUpdate) => void
    onInputClicked: () => void
    setText: (value: string) => void
    user: LoggedStudentPreview
    children?: React.ReactNode
}

export default BasicPostForm
