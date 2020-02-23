import React, {useCallback} from "react";
import {Post as PostType} from "../../data/post/types";
import Embed from "./Embed";
import EmbedType from "../../constants/EmbedType";
import {Avatar, Icon} from "antd";
import {useTranslation} from "react-i18next";

type PostProps = {
    data: PostType
    onDelete: (id: number) => Promise<void>
}

const Post: React.FC<PostProps> = ({data, onDelete}) => {
    const {t} = useTranslation();
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
    },[data.id, t]);



    return (
        <div className="flex flex-col rounded bg-white shadow my-5 p-4">
            <div>
                <p>
                    {data.description}
                </p>
                <Embed type={EmbedType.GALLERY}/>
            </div>
            <div className="flex flex-row justify-between mt-2">
                <Avatar icon="user" src={data.linkedClub?.logoUrl || data.author.photoUrlThumb}/>
                <div className="flex items-center">
                    <span className="flex items-center cursor-pointer hover:text-indigo-400 mr-3">
                        {data.nbComments} <Icon type="message" className="ml-1" />
                    </span>
                    <span className="flex items-center cursor-pointer hover:text-indigo-400 mr-3">
                        {data.nbLikes} <Icon type="heart" className="ml-1"/>
                    </span>
                    { data.hasWriteAccess &&
                        <>
                            <Icon type="edit" className="mr-3 cursor-pointer hover:text-indigo-400"/>
                            <Icon type="delete" className="mr-3 cursor-pointer hover:text-red-600" onClick={confirmDeletion}/>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default Post;