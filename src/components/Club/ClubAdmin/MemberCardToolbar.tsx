import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons"
import {faCheck, faSpinner, faUndo} from "@fortawesome/free-solid-svg-icons"
import React from "react"
import {useFormikContext} from "formik"

type MemberCardToolbarProps = {
    isEdited: boolean
    onDelete?: () => void
    visible?: boolean
}
const MemberCardToolbar: React.FC<MemberCardToolbarProps> = ({children, visible = true, onDelete, isEdited}) => {
    const {resetForm, isSubmitting, initialValues, submitForm} = useFormikContext()
    return (
        <span className="relative">
            {visible && (
                <span className="absolute -top-2 -right-1">
                    {isEdited ?
                        <>
                            <FontAwesomeIcon
                                onClick={() => resetForm({values: initialValues})}
                                icon={faUndo}
                                className="cursor-pointer shadow-md bg-white hover:bg-gray-300 p-1.5 mr-1 rounded-full text-gray-600 h-6 w-6"
                            />
                            {isSubmitting ?
                                <FontAwesomeIcon
                                    icon={faSpinner}
                                    spin
                                    inverse
                                    className="shadow-md bg-green-700 p-1.5 rounded-full text-white h-6 w-6"
                                /> :
                                <FontAwesomeIcon
                                    onClick={submitForm}
                                    icon={faCheck}
                                    className="cursor-pointer shadow-md bg-green-600 hover:bg-green-700 p-1.5 rounded-full text-white h-6 w-6"
                                />
                            }
                        </> :
                        <FontAwesomeIcon
                            onClick={onDelete}
                            icon={faTrashAlt}
                            className="cursor-pointer shadow-md bg-red-600 hover:bg-red-700 p-1.5 rounded-full text-white h-6 w-6"
                        />
                    }
                </span>
            )}
            {children}
        </span>
    )
}
export default MemberCardToolbar