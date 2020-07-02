import React, {useCallback, useEffect, useState} from "react";
import {Button, Divider, Icon, Input, message, Modal, Switch} from "antd";
import {useTranslation} from "react-i18next";
import {Link, useHistory} from "react-router-dom";
import {Group, GroupForm} from "../../data/group/types";
import {useFormik} from "formik";
import Loading from "../Common/Loading";
import ImagePicker from "../Common/ImagePicker";
import {IconFA} from "../Common/IconFA";
import StudentSelector from "../Student/StudentSelector";
import HelperIcon from "../Common/HelperIcon";

import './GroupEditor.css';
import {createGroup, deleteGroup, getGroup, toggleGroupArchiveStatus, updateGroup} from "../../data/group";

type GroupEditorProps = {
    id?: string,
    onDelete: (id: number) => void
    onArchive: (feed: Group) => void
    onCreate: (feed: Group) => void
    onUpdate: (feed: Group) => void
}

const DEFAULT_GROUP = {
    id: 0,
    restricted: false,
    name: "",
    admins: []
};

const GroupEditor: React.FC<GroupEditorProps> = ({id, onCreate, onDelete, onArchive, onUpdate}) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(false);
    const [group, setGroup] = useState<Group>()

    const formik = useFormik<GroupForm>({
        initialValues: DEFAULT_GROUP,
        onSubmit: async (values) => {
            // If feed is defined then we are editing a feed, otherwise we are creating a new feed
            let res;
            if (group) {
                res = await updateGroup(group.id, values);
                if (res.status === 200) {
                    onUpdate(res.data);
                    setGroup(res.data);
                    message.success("Modifications enregistrées !")
                }
            } else {
                res = await createGroup(values);
                if (res.status === 200) {
                    onCreate(res.data);
                    setGroup(res.data);
                    history.push(`/admin/group/${res.data.id}`);
                    message.success("Groupe créé !")
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
     * Get group's information according with the id props,
     * this effect is triggered at each new id update.
     */
    useEffect(() => {
        if (id !== undefined) {
            if (+id) {
                setLoading(true);
                getGroup(+id).then(res => {
                    if (res.status === 200) {
                        setGroup(res.data);
                        formik.setValues({
                            name: res.data.name,
                            restricted: res.data.restricted,
                            admins: res.data.admins.map(a => a.id)
                        })
                    } else {
                        message.error("Groupe inconnu: " + id);
                        history.push("/admin/group");
                    }
                }).finally(() => setLoading(false))
            } else {
                message.error("Groupe inconnu: " + id);
                history.push("/admin/group");
            }
        } else {
            setGroup(undefined);
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
                const res = await deleteGroup(group!.id);
                if (res.status === 200) {
                    onDelete(group!.id);
                    message.info(t('remove_item.complete'));
                    history.push("/admin/group");
                }
            }
        }), [onDelete, group, t]);

    const archive = useCallback(() => {
        // Tell TS that student is always defined when calling this function
        Modal.confirm({
            title: t(`archive_group.${+group!.archived}.title`),
            content: t(`archive_group.${+group!.archived}.content`),
            okText: 'Ok',
            cancelText: t('cancel'),
            onOk: async () => {
                const res = await toggleGroupArchiveStatus(group!.id);
                if (res.status === 200) {
                    group!.archived = res.data;
                    onArchive(group!);
                    message.info(t(`archive_group.${+group!.archived}.complete`));
                }
            }
        })
    }, [onArchive, group, t]);

    return (
        <div className="flex flex-col items-center bg-white shadow rounded-lg w-full md:w-1/2 mx-2 p-6 sticky"
             style={{height: "min-content", minHeight: "16rem", top: "1.5rem"}}
        >
            {loading ?
                <Loading size="4x"/> :
                <form className="relative flex flex-col w-full" onSubmit={formik.handleSubmit}>
                    {group &&
                    <Link to="/admin/group">
                        <div className="text-right absolute right-0 top-0 w-16">
                            <Icon type="close-circle" style={{fontSize: '26px'}}/>
                        </div>
                    </Link>
                    }

                    <ImagePicker className="cover-selector" onChange={handleImage} defaultImage={group?.cover}/>

                    <div className="flex mt-5">
                        <div className="flex flex-col mx-3">
                            <label className="font-dinotcb">Groupe privé
                                <HelperIcon
                                    text="Un groupe privé n'est visible et accessible que par les personnes faisant parti de celui-ci"
                                />
                            </label>
                            <Switch
                                className="m-auto"
                                checkedChildren={<IconFA name="fa-lock"/>}
                                unCheckedChildren={<IconFA name="fa-unlock"/>}
                                checked={formik.values.restricted}
                                onChange={(val) => formik.setFieldValue("restricted", val)}
                            />

                        </div>
                        <div className="flex-1 mx-3">
                            <label className="font-dinotcb">Nom du groupe</label>
                            <Input
                                required
                                placeholder="Entrez un nom pour votre groupe"
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
                            defaultValues={group?.admins}
                            onChange={(ids) => formik.setFieldValue("admins", ids)}
                        />
                    </div>

                    <div className="self-end flex flex-wrap justify-around w-full">
                        <Button htmlType="submit" type="primary" className="mt-5" icon="save">
                            Enregistrer
                        </Button>
                        {(group && !group.locked) &&
                        <>
                            <Button type="primary" className="mt-5" icon="audit" onClick={archive}>
                                {group.archived ? "Désarchiver" : "Archiver"}
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

export default GroupEditor;