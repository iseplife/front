import React, {useCallback, useState} from "react";
import {Post as PostType, PostUpdate} from "../../data/post/types";
import Embed from "./Embed";
import EmbedType from "../../constants/EmbedType";
import {Avatar, Icon} from "antd";
import {useTranslation} from "react-i18next";
import {toggleThreadLike} from "../../data/thread";
import {format, isPast} from "date-fns";
import {useFormik} from "formik";

type PostProps = {
    data: PostType
    editMode: boolean
    onDelete: (id: number) => Promise<void>
    onEdit: (id: number) => void
    onUpdate: (id: number, postUpdate: PostUpdate) => Promise<boolean>
}

type UpdatePostFormProps = {
    isPrivate: boolean
    publicationDate: number
    description: string
    onClose: () => void
    onUpdate: (updates: PostUpdate) => Promise<boolean>
}

const UpdatePostForm: React.FC<UpdatePostFormProps> = ({isPrivate, publicationDate, description, onClose, onUpdate}) => {
    const {t} = useTranslation();
    const [lockPost, setLockPost] = useState<boolean>(isPrivate);
    const formik = useFormik({
        initialValues: {
            private: isPrivate,
            publicationDate: new Date(publicationDate),
            description,
        },
        onSubmit: values => {
            onUpdate(values).then((r) => r && onClose());
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-row justify-end items-center">
                <div className="mx-2">
                    <span className="mx-2 text-xs">Publié à </span>
                    <input type="time" name="publication-time"
                           defaultValue={format(formik.values.publicationDate, "HH:mm")}
                           onChange={(e) => {
                               const val = e.target.valueAsDate;
                               if (val) {
                                   formik.values.publicationDate.setHours(val.getHours());
                                   formik.values.publicationDate.setMinutes(val.getMinutes());
                               }
                           }}/>
                    <input type="date" name="publication-date"
                           defaultValue={format(formik.values.publicationDate, "yyyy-MM-dd")}
                           onChange={(e) => {
                               const val = e.target.valueAsDate;
                               if (val) {
                                   formik.values.publicationDate.setFullYear(val.getFullYear());
                                   formik.values.publicationDate.setMonth(val.getMonth());
                                   formik.values.publicationDate.setDate(val.getDate());
                               }
                           }}/>
                </div>

                <div className="flex">
                    <Icon type={lockPost ? "lock" : "unlock"} onClick={() => setLockPost(!lockPost)}/>
                    <input className="hidden" name="private" type="checkbox" onChange={formik.handleChange}
                           checked={lockPost}/>
                </div>
            </div>
            <div>
                <textarea name="description" className="w-full resize-none" autoFocus
                          onChange={formik.handleChange}
                          value={formik.values.description}
                />
                <Embed type={EmbedType.GALLERY}/>
            </div>
            <div className="text-right">
                <button className="px-2 py-1 mx-1 rounded bg-green-500 text-white hover:bg-green-700" type="submit">
                    {t('save')}
                </button>
                <button className="px-2 py-1 mr-3 rounded bg-red-500 text-white hover:bg-red-700" type="button"
                        onClick={onClose}>
                    {t('cancel')}
                </button>
            </div>
        </form>
    );
};


const Post: React.FC<PostProps> = ({data, editMode, onDelete, onUpdate, onEdit}) => {
    const {t} = useTranslation();
    const [liked, setLiked] = useState<boolean>(data.liked);
    const [likes, setLikes] = useState<number>(data.nbLikes);
    const confirmDeletion = useCallback(() => {
        Modal.confirm({
            title: t('remove_item.title'),
            content: t('remove_item.content'),
            okText: 'Ok',
            cancelText: t('cancel'),
            onOk: () => {
                onDelete(data.id).then(() =>
                    message.info("Deletion complete")
                );
            }
        });
    }, [data.id, t, onDelete]);

    const toggleLike = async (id: number) => {
        const res = await toggleThreadLike(id);
        if (res.status === 200) {
            setLikes(liked ? likes - 1 : likes + 1);
            setLiked(!liked);
        }
    };


    return (
        <div className="flex flex-col rounded bg-white shadow my-5 p-4">
            {editMode ?
                <UpdatePostForm description={data.description} isPrivate={data.private}
                                publicationDate={data.publicationDate}
                                onClose={() => onEdit(0)}
                                onUpdate={(update: PostUpdate) => onUpdate(data.id, update)}
                /> :
                <>
                    <div className="flex flex-row justify-end items-center">
                        {!isPast(data.publicationDate) &&
                        <span
                            className="mx-2 text-xs"> Publié à {format(new Date(data.publicationDate), "HH:mm dd/MM/yy")}</span>
                        }
                        {data.private && <Icon type="lock"/>}
                    </div>
                    <div>
                        <p>
                            {data.description}
                        </p>
                        <Embed type={EmbedType.GALLERY}/>
                    </div>
                </>
            }
            <div className="flex flex-row justify-between mt-2">
                <Avatar icon="user" src={data.linkedClub?.logoUrl || data.author.photoUrlThumb}/>
                <div className="flex items-center">
                    <span className="flex items-center cursor-pointer hover:text-indigo-400 mr-3">
                        {data.nbComments} <Icon type="message" className="ml-1"/>
                    </span>
                    <span className="flex items-center cursor-pointer hover:text-indigo-400 mr-3">
                        {likes}
                        <Icon type="heart" className="ml-1" onClick={() => toggleLike(data.thread)}
                              theme={liked ? "filled" : "outlined"}
                        />
                    </span>
                    {data.hasWriteAccess &&
                    <>
                        <Icon type="edit" className="mr-3 cursor-pointer hover:text-indigo-400"
                              onClick={() => onEdit(data.id)}/>
                        <Icon type="delete" className="mr-3 cursor-pointer hover:text-red-600"
                              onClick={confirmDeletion}/>
                    </>
                    }
                </div>
            </div>
        </div>
    );
};

export default Post;