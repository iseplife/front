import React, {useCallback, useState} from "react";
import {IconFA} from "../Common/IconFA";
import {EmbedCreation, Post, PostCreation} from "../../data/post/types";
import {Field, Form, FormikErrors, FormikProps, withFormik} from "formik";
import {Divider, message, Upload} from "antd";
import AvatarPicker from "../Common/AvatarPicker";
import {createPost} from "../../data/post";
import EmbedType from "../../constants/EmbedType";
import EmbedForm, {FileStore} from "./EmbedForm";
import {createMedia} from "../../data/media";
import {createGallery} from "../../data/gallery";

export type FormValues = {
    description: string
    private: boolean
    draft: boolean
    feed: number
    linkedClub?: number
    embed?: EmbedCreation
}
const InnerForm: React.FC<FormikProps<FormValues>> = ({isSubmitting, setFieldValue, setValues, values, errors, setFieldError}) => {
        const [fileStore, setFileStore] = useState<FileStore>([]);

        const handleFile = useCallback((type: EmbedType) => (file: File, files: File[]) => {
            if(values.embed?.type !== type)
                setFileStore([]);

            if (type === EmbedType.IMAGE) {
                if (files.length > 5) {
                    setFieldError("attachments", "Vous ne pouvez pas publier plus de 3 photos")
                    return false;
                }
                const reader = new FileReader();
                reader.onload = e => setFileStore(store => [
                    ...store,
                    {
                        file,
                        preview: reader.result as string
                    }
                ])

                reader.readAsDataURL(file);
                setFieldValue('embed', {type, data: files});
            } else {
                setFileStore([{file: files[0]}]);
                setFieldValue('embed', {type, data: files[0]});
            }
            return false;
        }, [setFieldError, setFieldValue]);

        return (
            <Form className="flex flex-col items-center">
                <div className="flex flex-col bg-white rounded-lg w-4/6 py-3 px-4 text-gray-500" style={{minHeight: "5rem"}}>
                    <Field type="textarea" name="description" placeholder="What's on your mind ?"
                           className="text-gray-800 flex-1 mb-4 bg-transparent resize-none"
                    />
                    {values.embed &&
                    <EmbedForm files={fileStore} setFiles={setFileStore}/>
                    }
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <Upload showUploadList={false} multiple beforeUpload={handleFile(EmbedType.IMAGE)}>
                                <IconFA name="fa-images" className="text-gray-500 cursor-pointer mx-1 hover:text-gray-700"/>
                            </Upload>
                            <Upload showUploadList={false} beforeUpload={handleFile(EmbedType.DOCUMENT)}>
                                <IconFA name="fa-paperclip" type="solid" className="text-gray-500 cursor-pointer mx-1 hover:text-gray-700"/>
                            </Upload>
                            <div><IconFA name="fa-chart-bar" className="cursor-pointer mx-1 hover:text-gray-700"/></div>
                        </div>
                        <div className="flex-1 flex justify-end items-center">
                            <AvatarPicker callback={(id) => setValues({...values, linkedClub: id})} className="mr-3"/>
                            <Divider type="vertical"/>
                        </div>
                        <div className="flex items-center">
                            <button
                                type="submit"
                                disabled={isSubmitting || !values.description.length}
                                className={values.description.length ? "cursor-pointer hover:text-gray-700" : "cursor-default text-gray-300"}
                            >
                                <IconFA name={isSubmitting ? "fa-circle-notch fa-spin" : "fa-paper-plane"} type="solid"/>
                            </button>
                        </div>
                    </div>
                </div>
            </Form>
        );
    }
;

type PostFormProps = {
    feedId: number
    onPost: (post: Post) => void
}
const PostForm = withFormik<PostFormProps, FormValues>({
    mapPropsToValues: (props) => {
        return {
            description: "",
            feed: props.feedId,
            private: true,
            draft: true,
        };
    },

    validate: (values: FormValues) => {
        const errors: FormikErrors<any> = {}
        if (!values.description.length) {
            errors.description = "Required"
        }
        return errors
    },


    handleSubmit: async (values, {props, resetForm}) => {
        const {embed, ...post} = values
        if (embed) {
            let res: { data: { id: number } };

            switch (embed.type) {
                case EmbedType.IMAGE:
                    if (embed.data.length > 1 && embed.data.length < 6) {
                        const ids = [];
                        for (const f of embed.data) {
                            const res = await createMedia(f)
                            ids.push(res.data.id)
                        }

                        res = await createGallery({
                            feed: props.feedId,
                            pseudo: true,
                            images: ids
                        });

                    } else {
                        res = await createMedia(embed.data[0]);
                    }
                    break;
                case EmbedType.DOCUMENT:
                case EmbedType.VIDEO:
                    res = await createMedia(embed.data[0]);
                    break;
                case EmbedType.GALLERY:
                    const id = [];
                    for (const f of embed.data.images) {
                        const res = await createMedia(f)
                        id.push(res.data.id)
                    }

                    res = await createGallery({
                        feed: props.feedId,
                        pseudo: true,
                        images: id
                    });
                case EmbedType.POLL:
                    //res = createPoll(values.embed.data);
                    break;

            }

            if(embed.type === EmbedType.IMAGE && embed.data.length > 1){
                (post as PostCreation).attachements = { [EmbedType.GALLERY]: res!.data.id }
            }else{
                (post as PostCreation).attachements = { [embed.type]: res!.data.id }
            }

        }

        const res = await createPost(post as PostCreation);
        if (res.status === 200) {
            props.onPost(res.data);
            resetForm({});
            message.success("Post publié !");
        }
    },
})(InnerForm);


export default PostForm