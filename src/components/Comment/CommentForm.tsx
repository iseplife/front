import React, {useState} from "react";
import {Avatar} from "antd";
import {useSelector} from "react-redux";
import {AppState} from "../../redux/types";
import {useFormik} from "formik";
import {IconFA} from "../Common/IconFA";

interface CommentFormProps {
    handleUpload: (message: string) => Promise<void>
}
const CommentForm: React.FC<CommentFormProps> = ({handleUpload}) => {
    const thumbnail = useSelector((state: AppState) => state.user.photoUrlThumb);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            message: ""
        },
        onSubmit: ({message}, {resetForm}) => {
            setSubmitting(true);
            handleUpload(message).then(() => {
                setSubmitting(false);
                resetForm({});
            });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="rounded-full border border-solid border-gray-200 flex px-2 py-1 mt-3">
            <Avatar icon="user" src={thumbnail} size="small" className="mr-3"/>
            <input id="message"
                   placeholder="Write your comment"
                   className="message border-none flex-1 bg-transparent"
                   type="text"
                   onChange={formik.handleChange}
                   value={formik.values.message}
            />
            <button type="submit" className="cursor-pointer text-gray-500 hover:text-gray-700 px-2" disabled={isSubmitting}>
                <IconFA name={isSubmitting ? "fa-circle-notch fa-spin" : "fa-paper-plane"} type="solid" />
            </button>
        </form>
    );
};

export default CommentForm;