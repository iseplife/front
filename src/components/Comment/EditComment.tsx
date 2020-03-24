import {Icon} from "antd";
import {IconFA} from "../Common/IconFA";
import React, {useState} from "react";

interface EditCommentProps {
    value: string,
    uploadEdit: (msg: string) => Promise<void>
    disableEditMode: () => void
}

const EditComment: React.FC<EditCommentProps> = ({value, uploadEdit, disableEditMode}) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false);
    const [editedMessage, setEditedMessage] = useState<string>(value);

    return (
        <div className="flex">
            <textarea
                autoFocus
                defaultValue={editedMessage}
                value={editedMessage}
                className="bg-transparent w-full focus"
                onChange={(e) => setEditedMessage(e.target.value)}
            />
            <div className="flex items-center justify-end self-end">
                <button type="submit"
                        className="flex items-center cursor-pointer text-gray-500 hover:text-red-600 px-2"
                        disabled={isSubmitting}
                        onClick={disableEditMode}
                >
                    <IconFA name="fa-times" type="solid" size="lg" />
                </button>
                <button type="submit"
                        className="flex items-center cursor-pointer text-gray-500 hover:text-green-400 px-2"
                        disabled={isSubmitting || editedMessage.length === 0}
                        onClick={() => {
                            setSubmitting(true);
                            uploadEdit(editedMessage).then(res => {
                                disableEditMode();
                            }).finally(() => setSubmitting(false));
                        }}
                >
                    <IconFA name={isSubmitting ? "fa-circle-notch fa-spin" : "fa-save"} type="solid" size="lg" />
                </button>
            </div>
        </div>
    );
}

export default EditComment;