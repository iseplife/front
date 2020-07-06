import React, {useCallback, useEffect, useState} from "react";
import {Button, Divider, Input, InputNumber, message, Modal, Select} from "antd";
import {useTranslation} from "react-i18next";
import {Link, useHistory} from "react-router-dom";
import {useFormik} from "formik";
import {Club, ClubForm} from "../../data/club/types";
import {createClub, deleteClub, getClub, getClubAdmins, toggleClubArchiveStatus, updateClub, uploadLogo} from "../../data/club";
import ClubType, {ClubTypeArray} from "../../constants/ClubType";
import ImagePicker from "../Common/ImagePicker";
import Loading from "../Common/Loading";
import {IconFA} from "../Common/IconFA";
import StudentSelector from "../Student/StudentSelector";
import {StudentPreview} from "../../data/student/types";
import {format} from "date-fns";
import {CloseCircleOutlined, DeleteOutlined, SaveOutlined, AuditOutlined} from '@ant-design/icons';

type ClubEditorProps = {
    id?: string
    onDelete: (id: number) => void
    onArchive: (club: Club) => void
    onCreate: (club: Club) => void
    onUpdate: (club: Club) => void
}

const DEFAULT_CLUB = {
    name: "",
    description: "",
    creation: new Date(),
    type: ClubType.CLUB,
    admins: []
};

const ClubEditor: React.FC<ClubEditorProps> = ({id, onUpdate, onArchive, onDelete, onCreate}) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(false);
    const [club, setClub] = useState<Club>();
    const [admins, setAdmins] = useState<StudentPreview[]>();

    const formik = useFormik<ClubForm>({
        initialValues: DEFAULT_CLUB,
        onSubmit: async (values) => {
            // If feed is defined then we are editing a feed, otherwise we are creating a new feed
            let res;
            if (club) {
                const {logo, ...form} = values;

                res = await updateClub(club.id, form);
                if (res.status === 200) {
                    const newClub = res.data;
                    onUpdate(res.data);
                    setClub(newClub);

                    message.success("Modifications enregistrées !")
                }
                if (logo) {
                    res = await uploadLogo(club.id, logo);
                    if (res.status === 200) {
                        club.logoUrl = res.data;
                    }else {
                        message.error("Un problème lors de l'envoie du logo a été rencontré.")
                    }
                }
            } else {
                const {logo, ...form} = values;

                res = await createClub(form);
                if (res.status === 200) {
                    const newClub = res.data;
                    if (logo) {
                        res = await uploadLogo(res.data.id, logo);
                        if (res.status === 200) newClub.logoUrl = res.data;
                    }
                    onCreate(newClub);
                    setClub(newClub);
                    history.push(`/admin/club/${newClub.id}`);
                    message.success("Association créée !")
                }
            }
        }
    });

    /**
     * Get club's information according with the id props,
     * this effect is triggered at each new id update.
     */
    useEffect(() => {
        if (id !== undefined) {
            if (+id) {
                setLoading(true);
                getClub(+id).then(res => {
                    if (res.status === 200) {
                        setClub(res.data);
                        formik.setValues({
                            ...res.data,
                            admins: [],
                            creation: new Date(res.data.creation)
                        });
                    } else {
                        message.error("Club inconnu: " + id);
                        history.push("/admin/club");
                    }
                }).finally(() => setLoading(false))

                getClubAdmins(+id).then(res => {
                    if (res.status === 200) {
                        setAdmins(res.data)
                        formik.setFieldValue("admins", res.data.map(s => s.id));
                    } else {
                        message.error("Impossible de récupérer les admins ");
                    }
                });
            } else {
                message.error("Club inconnu: " + id);
                history.push("/admin/club");
            }
        } else {
            setAdmins([]);
            setClub(undefined);
            formik.resetForm();
        }
    }, [id]);

    const handleImage = (file: File | null) => {
        formik.setFieldValue('logo', file);
        if (!file) {
            //formik.setFieldValue('resetLogo', true)
        }
    };

    const remove = useCallback(() =>
        Modal.confirm({
            title: t('remove_item.title'),
            content: t('remove_item.content'),
            okText: 'Ok',
            cancelText: t('cancel'),
            onOk: async () => {
                const res = await deleteClub(club!.id);
                if (res.status === 200) {
                    onDelete(club!.id);
                    message.info(t('remove_item.complete'));
                    history.push("/admin/club");
                }
            }
        }), [onDelete, club, t]);

    const archive = useCallback(() => {
        // Tell TS that student is always defined when calling this function
        Modal.confirm({
            title: t(`archive_group.${+club!.archived}.title`),
            content: t(`archive_group.${+club!.archived}.content`),
            okText: 'Ok',
            cancelText: t('cancel'),
            onOk: async () => {
                const res = await toggleClubArchiveStatus(club!.id);
                if (res.status === 200) {
                    club!.archived = res.data;
                    onArchive(club!);
                    message.info(t(`archive_group.${+club!.archived}.complete`));
                }
            }
        })
    }, [onArchive, club, t]);

    return (
        <div className="flex flex-col items-center bg-white shadow rounded-lg w-full md:w-1/3 mx-2 p-6 sticky"
             style={{height: "min-content", minHeight: "20rem", top: "1.5rem"}}
        >
            {loading ?
                <Loading size="4x"/> :
                <form className="relative flex flex-col w-full" onSubmit={formik.handleSubmit}>

                    <div className="flex flex-col absolute left-0 top-0 w-32">
                        <label className="font-dinotcb">Type</label>
                        <Select
                            value={t(`club_type.${formik.values.type.valueOf()}`)}
                            onChange={(value: ClubType) => formik.setFieldValue("type", value)}
                        >
                            {ClubTypeArray.map(type => (
                                <Select.Option key={type} value={type}>
                                    {t(`club_type.${type}`)}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    {club &&
                    <Link to="/admin/club">
                        <div className="text-right absolute right-0 top-0 w-16">
                            <CloseCircleOutlined style={{fontSize: '26px'}}/>
                        </div>
                    </Link>
                    }

                    <ImagePicker onChange={handleImage} defaultImage={club?.logoUrl}/>

                    <div className="flex justify-between mx-3">
                        <div className="w-1/2">
                            <label className="font-dinotcb">Nom de l'association</label>
                            <Input
                                required
                                placeholder="Nom"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="w-2/5">
                            <label className="font-dinotcb">Date de création</label>
                            <Input
                                name="creation"
                                type="date"
                                value={format(formik.values.creation, "yyyy-MM-dd")}
                                onChange={(e) => formik.setFieldValue("creation", e.target.valueAsDate)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 mx-3 ">
                        <label className="font-dinotcb">Description</label>
                        <Input.TextArea
                            required
                            rows={4}
                            placeholder="Décrivez l'association en quelques lignes..."
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <Divider/>
                    {admins &&
                    <div className="mx-3">
                        <label className="font-dinotcb">Administrateurs</label>
                        <StudentSelector
                            defaultValues={admins}
                            onChange={(ids) => formik.setFieldValue("admins", ids)}
                        />
                    </div>
                    }

                    <div className="flex mx-3 mt-3 mb-5">
                        <div className="flex-1 mx-1">
                            <label className="font-dinotcb">Site Internet</label>
                            <Input
                                name="website"
                                placeholder="Lien Facebook"
                                suffix={<IconFA name="fa-link"/>}/>
                        </div>
                        <div className="flex-1 mx-1">
                            <label className="font-dinotcb">Instagram</label>
                            <Input
                                name="instagram"
                                placeholder="Lien Instagram"
                                suffix={<IconFA type="brands" name="fa-instagram"/>}/>
                        </div>
                        <div className="flex-1 mx-1">
                            <label className="font-dinotcb">Facebook</label>
                            <Input
                                name="facebook"
                                placeholder="Lien site internet"
                                suffix={<IconFA type="brands" name="fa-facebook-f"/>}
                            />
                        </div>


                    </div>

                    <div className="self-end flex flex-wrap justify-around w-full">
                        <Button htmlType="submit" type="primary" icon={<SaveOutlined/>}>
                            Enregistrer
                        </Button>
                        {club &&
                        <>
                            <Button type="primary" icon={<AuditOutlined/>} onClick={archive}>
                                {club.archived ? "Désarchiver" : "Archiver"}
                            </Button>
                            <Button danger icon={<DeleteOutlined/>} onClick={remove}>
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

export default ClubEditor;