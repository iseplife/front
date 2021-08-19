import React, {useState} from "react"
import TextArea from "antd/lib/input/TextArea"
import {faCircleNotch, faSave, faTimes} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

interface EditCommentProps {
    value: string,
    uploadEdit: (msg: string) => Promise<void>
    disableEditMode: () => void
}

const EditComment: React.FC<EditCommentProps> = ({value = "", uploadEdit, disableEditMode}) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [editedMessage, setEditedMessage] = useState<string>(value)

    return (
        <div>
            <TextArea
                autoFocus
                value={editedMessage}
                className="bg-transparent border-none focus mb-2"
                onChange={(e) => setEditedMessage(e.target.value)}
            />
            <div className="flex items-center justify-end self-end">
                <button type="submit"
                    className="flex items-center cursor-pointer text-gray-500 hover:text-red-600 px-2"
                    disabled={isSubmitting}
                    onClick={disableEditMode}
                >
                    <FontAwesomeIcon icon={faTimes} size="lg"/>
                </button>
                <button
                    type="submit"
                    className="flex items-center cursor-pointer text-gray-500 hover:text-green-400 px-2"
                    disabled={isSubmitting || !editedMessage}
                    onClick={() => {
                        setSubmitting(true)
                        uploadEdit(editedMessage).then(() => {
                            disableEditMode()
                        }).finally(() => setSubmitting(false))
                    }}
                >
                    <FontAwesomeIcon icon={isSubmitting ? faCircleNotch: faSave} spin={isSubmitting} size="lg"/>
                </button>
            </div>
        </div>
    )
}

export default EditComment
