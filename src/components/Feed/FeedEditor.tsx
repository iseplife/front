import React, {useCallback, useEffect, useState} from "react";
import {Button, Divider, Input, message, Modal, Switch} from "antd";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {Feed, FeedForm} from "../../data/feed/types";
import {createFeed, deleteFeed, getFeed, toggleFeedArchiveStatus, updateFeed} from "../../data/feed";
import {useFormik} from "formik";
import Loading from "../Common/Loading";
import ImagePicker from "../Common/ImagePicker";
import {IconFA} from "../Common/IconFA";
import StudentSelector from "../Student/StudentSelector";
import HelperIcon from "../Common/HelperIcon";

import './FeedEditor.css';

type FeedEditorProps = {
    id?: string,
    onDelete: (id: number) => void
    onArchive: (feed: Feed) => void
    onCreate: (feed: Feed) => void
    onUpdate: (feed: Feed) => void
}

const DEFAULT_FEED = {
    id: 0,
    restricted: false,
    name: "",
    admins: []
};

const FeedEditor: React.FC<FeedEditorProps> = ({id, onCreate, onDelete, onArchive, onUpdate}) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(false);
    const [feed, setFeed] = useState<Feed>()

    const formik = useFormik<FeedForm>({
        initialValues: DEFAULT_FEED,
        onSubmit: async (values) => {
            // If feed is defined then we are editing a feed, otherwise we are creating a new feed
            let res;
            if (feed) {
                res = await updateFeed(feed.id, values);
                if (res.status === 200) {
                    onUpdate(res.data);
                    setFeed(res.data);
                }
            } else {
                res = await createFeed(values);
                if (res.status === 200) {
                    onCreate(res.data);
                    setFeed(res.data);
                    history.push(`/admin/user/${res.data.id}`);
                }
            }
        },
    });

    const handleImage = (file: File | null) => {
        formik.setFieldValue('cover', file);
        if (!file) {
            formik.setFieldValue('resetCover', true)
        }
    };

    /**
     * Get Feed's information according with the id props,
     * this effect is triggered at each new id update.
     */
    useEffect(() => {
        if (id !== undefined) {
            if (+id) {
                setLoading(true);
                getFeed(+id).then(res => {
                    if (res.status === 200) {
                        setFeed(res.data);
                        formik.setValues({
                            name: res.data.name,
                            restricted: res.data.restricted,
                            admins: res.data.admins.map(a => a.id)
                        })
                    } else {
                        message.error("Feed inconnu: " + id)
                    }
                }).finally(() => setLoading(false))
            } else {
                message.error("Feed inconnu: " + id)
            }
        } else {
            setFeed(undefined);
            formik.resetForm();
        }
    }, [id]);


    const remove = useCallback(() =>
        Modal.confirm({
            title: t('remove_item.title'),
            content: t('remove_item.content'),
            okText: 'Ok',
            cancelText: t('cancel'),
            onOk: async () => {
                const id = (feed as Feed).id;
                const res = await deleteFeed(id);
                if (res.status === 200) {
                    onDelete(id);
                    message.info(t('remove_item.complete'));
                }
            }
        }), [onDelete, feed, t]);

    const archive = useCallback(() => {
        // Tell TS that student is always defined when calling this function
        const f = (feed as Feed);
        Modal.confirm({
            title: t(`archive_feed.${+f.archived}.title`),
            content: t(`archive_feed.${+f.archived}.content`),
            okText: 'Ok',
            cancelText: t('cancel'),
            onOk: async () => {
                const res = await toggleFeedArchiveStatus(f.id);
                if (res.status === 200) {
                    onArchive(res.data);
                    setFeed(res.data);
                    message.info(t(`archive_feed.${+f.archived}.complete`));
                }
            }
        })
    }, [onArchive, feed, t]);

    return (
        <div className="flex flex-col items-center bg-white shadow rounded-lg w-full md:w-1/2 mx-2 p-6 sticky"
             style={{height: "min-content", minHeight: "16rem", top: 5}}
        >
            {loading ?
                <Loading size="4x"/> :
                <form className="relative flex flex-col w-full" onSubmit={formik.handleSubmit}>
                    <ImagePicker className="cover-selector" onChange={handleImage} defaultImage={feed?.cover}/>

                   <div className="flex mt-5">
                       <div className="flex flex-col mx-3">
                           <label className="font-dinotcb">Feed privé
                              <HelperIcon
                                  text="Un feed privé n'est visible et accessible que par les personnes faisant parti de ce feed"
                              />
                           </label>
                           <Switch
                               className="m-auto"
                               checkedChildren={<IconFA type="solid" name="fa-lock"/>}
                               unCheckedChildren={<IconFA type="solid" name="fa-unlock"/>}
                               checked={formik.values.restricted}
                               onChange={(val) => formik.setFieldValue("restricted", val)}
                           />

                       </div>
                       <div className="flex-1 mx-3">
                           <label className="font-dinotcb">Nom du feed</label>
                           <Input
                               required
                               placeholder="Entrez un nom pour votre feed"
                               name="name"
                               value={formik.values.name}
                               onChange={formik.handleChange}
                           />
                       </div>
                   </div>
                    <Divider/>
                    <div className="mx-3 mb-5">
                        <label className="font-dinotcb">Administrateurs</label>
                        <StudentSelector
                            defaultValues={feed?.admins}
                            onChange={(ids) => formik.setFieldValue("admins", ids)}
                        />
                    </div>

                    <div className="self-end flex flex-wrap justify-around w-full">
                        <Button htmlType="submit" type="primary" className="mt-5" icon="save">
                            Enregistrer
                        </Button>
                        {feed &&
                        <>
                            <Button type="primary" className="mt-5" icon="audit" onClick={archive}>
                                {feed.archived ? "Désarchiver" : "Archiver"}
                            </Button>
                            <Button type="danger" className="mt-5" icon="delete" onClick={remove}>
                                Supprimer
                            </Button>
                        </>
                        }
                    </div>
                </form>
            }
        </div>
    )
}

export default FeedEditor;