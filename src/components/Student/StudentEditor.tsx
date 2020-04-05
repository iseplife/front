import React, {useCallback, useEffect, useState} from "react";
import {
    createStudent,
    deleteStudent,
    getStudent,
    toggleStudentArchiveStatus,
    updateStudentAdmin
} from "../../data/student";
import {Button, Icon, Input, InputNumber, message, Modal, Upload} from "antd";
import Loading from "../Common/Loading";
import {useFormik} from "formik";
import "./Student.css"
import {Student, StudentAdminForm} from "../../data/student/types";
import {Link} from "react-router-dom";
import {format} from "date-fns";
import {useTranslation} from "react-i18next";


interface StudentEditorProps {
    id?: string
    onDelete: (id: number) => void
    onArchive: (id: number, status: boolean) => void
    onCreate: (student: Student) => void
    onUpdate: (student: Student) => void
}

const DEFAULT_USER = {
    id: 0,
    promo: new Date().getFullYear().toString(),
    firstName: "",
    lastName: "",
    mail: ""
};


const StudentEditor: React.FC<StudentEditorProps> = ({id, onUpdate, onDelete, onCreate, onArchive}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const {t} = useTranslation();
    const [student, setStudent] = useState<Student>();
    const [thumbnail, setThumbnail] = useState<string>();
    const [uploading, setUploading] = useState<boolean>();

    const formik = useFormik<StudentAdminForm>({
        initialValues: DEFAULT_USER,
        onSubmit: async (values) => {
            // If student is defined then we are editing an user, otherwise we are creating an user
            let res;
            if (student) {
                res = await createStudent(values);
                if (res.status === 200) {
                    onCreate(res.data);
                }
            } else {
                res = await updateStudentAdmin(values);
                if (res.status === 200) {
                    onUpdate(res.data);
                }
            }
        },
    });

    /**
     * Get student information according with the id props,
     * this effect is triggered at each new id update.
     */
    useEffect(() => {
        if (id !== undefined) {
            if (+id) {
                setLoading(true);
                getStudent(+id).then(res => {
                    if (res.status === 200) {
                        setStudent(res.data);
                        setThumbnail(res.data.photoUrlThumb);
                        formik.setValues({
                            id: res.data.id,
                            promo: res.data.promo.toString(),
                            firstName: res.data.firstName,
                            lastName: res.data.lastName,
                            mail: res.data.mail,
                            birthDate: res.data.birthDate ? new Date(res.data.birthDate) : undefined
                        })
                    } else {
                        message.error("Utilisateur inconnu: " + id)
                    }
                }).finally(() => setLoading(false))
            } else {
                message.error("Utilisateur inconnu: " + id)
            }
        } else {
            setStudent(undefined);
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
                const id = (student as Student).id;
                const res = await deleteStudent(id);
                if (res.status === 200) {
                    onDelete(id);
                    message.info(t('remove_item.complete'));
                }
            }
        }),[onDelete, student, t]);

    const archive = useCallback(() =>
        {
            // Tell TS that student is always defined when calling this function
            const s = (student as Student);
            Modal.confirm({
                title: t(`archive_item.${+s.archived}.title`),
                content: t(`archive_item.${+s.archived}.content`),
                okText: 'Ok',
                cancelText: t('cancel'),
                onOk: async () => {
                    const res = await toggleStudentArchiveStatus(s.id);
                    if (res.status === 200) {
                        onArchive(s.id, res.data);
                        message.info(t(`archive_item.${+s.archived}.complete`));
                    }
                }
            })
    }, [onArchive, student, t]);


    return (
        <div className="flex flex-col items-center bg-white shadow rounded w-full md:w-1/3 mx-2 p-6 sticky"
             style={{height: "min-content", minHeight: "16rem", top: 5}}
        >
            {loading ?
                <Loading size="4x"/> :
                <form className="relative flex flex-col">
                    <div className="absolute left-0 top-0 w-16">
                        <label className="font-dinotcb">numéro élève</label>
                        <InputNumber
                            name="id"
                            className="border-none pl-1"
                            formatter={(val = 0) => val.toString().padStart(4, "0")}
                            value={formik.values.id}
                            onChange={(val) => formik.setFieldValue("id", val)}
                        />
                    </div>

                    {student &&
                    <Link to="/admin/user">
                        <div className="text-right absolute right-0 top-0 w-16">
                            <Icon type="close-circle" style={{fontSize: '26px'}}/>
                        </div>
                    </Link>
                    }
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader flex justify-center mt-5"
                        showUploadList={false}
                        //beforeUpload={beforeUpload}
                        //onChange={formik.handleChange}
                    >
                        {thumbnail ?
                            <img src={thumbnail} alt="avatar" style={{width: '100%'}}/> :
                            <div>
                                <Icon type={uploading ? 'loading' : 'plus'}/>
                                <div className="ant-upload-text">Upload</div>
                            </div>
                        }
                    </Upload>

                    <div className="flex flex-row my-5">
                        <div className="mr-2 w-1/2">
                            <label>prénom</label>
                            <Input placeholder="Dieudonné" name="fistName" value={formik.values.firstName}
                                   onChange={formik.handleChange}/>
                        </div>
                        <div className="ml-2 w-1/2">
                            <label>nom</label>
                            <Input placeholder="Abboud" name="lastName" value={formik.values.lastName}
                                   onChange={formik.handleChange}/>
                        </div>
                    </div>

                    <div className="flex flex-row my-5">
                        <div className="w-32 mr-2">
                            <label htmlFor="promo">promo</label>
                            <Input placeholder="1968" name="promo" value={formik.values.promo}
                                   onChange={formik.handleChange}/>
                        </div>
                        <div className="ml-2">
                            <label htmlFor="birthdate">date de naissance</label>
                            <Input
                                placeholder="29/01/1968" name="birthdate" type="date"
                                value={formik.values.birthDate && format(formik.values.birthDate, "yyyy-MM-dd")}
                                onChange={(e) => formik.setFieldValue("birthdate", e.target.valueAsDate)}
                            />
                        </div>
                    </div>

                    <div className="my-5">
                        <label htmlFor="email">email</label>
                        <Input placeholder="dieudonne.abboud@isep.fr" name="mail" value={formik.values.mail}
                               onChange={formik.handleChange}/>
                    </div>

                    <div className="self-end flex justify-around w-full">
                        <Button type="primary" className="mt-5" icon="save" onClick={remove}>
                            Enregistrer
                        </Button>
                        {student &&
                        <>
                            <Button type="primary" className="mt-5" icon="audit" onClick={archive}>
                                {student.archived ? "Désarchiver": "Archiver"}
                            </Button>
                            <Button type="danger" className="mt-5" icon="delete">
                                Supprimer
                            </Button>
                        </>
                        }
                    </div>

                </form>
            }
        </div>
    )
};

export default StudentEditor;