import React, {useCallback, useEffect, useState} from "react";
import {
    createStudent,
    deleteStudent, getStudentAdmin,
    toggleStudentArchiveStatus,
    updateStudentAdmin
} from "../../data/student";
import {Button, Divider, Icon, Input, InputNumber, message, Modal, Select} from "antd";
import Loading from "../Common/Loading";
import {useFormik} from "formik";
import {Student, StudentAdminForm, StudentAdmin} from "../../data/student/types";
import {Link, useHistory} from "react-router-dom";
import {format} from "date-fns";
import {useTranslation} from "react-i18next";
import ImagePicker from "../Common/ImagePicker";
import {Role} from "../../data/security/types";

const {Option} = Select;

type StudentEditorProps = {
    id?: string
    roles?: Role[]
    onDelete: (id: number) => void
    onArchive: (student: StudentAdmin) => void
    onCreate: (student: StudentAdmin) => void
    onUpdate: (student: StudentAdmin) => void
}

const DEFAULT_USER = {
    id: 0,
    roles: ["ROLE_STUDENT"],
    promo: new Date().getFullYear(),
    firstName: "",
    lastName: "",
};


const StudentEditor: React.FC<StudentEditorProps> = ({id, onUpdate, onDelete, onCreate, onArchive, roles}) => {
    const {t} = useTranslation();
    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(false);
    const [student, setStudent] = useState<Student>();

    const formik = useFormik<StudentAdminForm>({
        initialValues: DEFAULT_USER,
        onSubmit: async (values) => {
            // If student is defined then we are editing an user, otherwise we are creating an user
            let res;
            if (student) {
                res = await updateStudentAdmin(values);
                if (res.status === 200) {
                    onUpdate(res.data);
                    setStudent(res.data);
                }
            } else {
                res = await createStudent(values);
                if (res.status === 200) {
                    onCreate(res.data);
                    setStudent(res.data);
                    history.push(`/admin/user/${res.data.id}`);
                }
            }
        },
    });

    const handleImage = (file: File | null) => {
        formik.setFieldValue('picture', file);
        if (!file) {
            formik.setFieldValue('resetPicture', true)
        }
    };

    /**
     * Get student information according with the id props,
     * this effect is triggered at each new id update.
     */
    useEffect(() => {
        if (id !== undefined) {
            if (+id) {
                setLoading(true);
                getStudentAdmin(+id).then(res => {
                    if (res.status === 200) {
                        setStudent(res.data);
                        formik.setValues({
                            id: res.data.id,
                            roles: res.data.roles,
                            promo: res.data.promo,
                            firstName: res.data.firstName,
                            lastName: res.data.lastName,
                            mail: res.data.mail,
                            phone: res.data.phone,
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
        }), [onDelete, student, t]);

    const archive = useCallback(() => {
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
                    onArchive(res.data);
                    setStudent(res.data);
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
                <form className="relative flex flex-col" onSubmit={formik.handleSubmit}>

                    <div className="absolute left-0 top-0 w-16">
                        {student?.archived &&
                        <div className="flex items-center text-red-600 font-bold">
                            <Icon type="lock" className="mr-1"/> ARCHIVÉ
                        </div>
                        }
                        <label className="font-dinotcb">numéro élève</label>
                        <InputNumber
                            required
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

                    <ImagePicker onChange={handleImage} defaultImage={student?.picture}/>

                    <div className="w-16 mb-1">
                        <div>
                            <label className="font-dinotcb">roles</label>
                            <Select
                                mode="multiple"
                                value={formik.values.roles}
                                notFoundContent={roles ? <Loading size="sm"/> : null}
                                onChange={(val: string[]) => formik.setFieldValue("roles", val)}
                            >
                                { roles && roles.map(r => (
                                    <Option key={r.id} value={r.role}>{r.role}</Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label className="font-dinotcb">promo</label>
                            <InputNumber
                                name="promo"
                                value={formik.values.promo}
                                onChange={(val) => formik.setFieldValue("promo", val)}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row ">
                        <div className="mr-2 w-1/2">
                            <label className="font-dinotcb">prénom</label>
                            <Input
                                required
                                placeholder="Dieudonné"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="ml-2 w-1/2">
                            <label className="font-dinotcb">nom</label>
                            <Input
                                required
                                placeholder="Abboud"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>

                    <Divider/>

                    <div className="my-1 flex justify-between">
                        <div className="mr-1">
                            <label className="font-dinotcb">email</label>
                            <Input placeholder="dieudonne.abboud@isep.fr"
                                   name="mail"
                                   value={formik.values.mail}
                                   onChange={formik.handleChange}
                            />
                        </div>
                        <div className="w-32">
                            <label className="font-dinotcb">téléphone</label>
                            <Input
                                pattern="^((\+)33|0)[1-9](\d{2}){4}$"
                                placeholder="0781140407"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="font-dinotcb">date de naissance</label>
                        <Input
                            placeholder="29/01/1968"
                            name="birthdate"
                            type="date"
                            value={formik.values.birthDate && format(formik.values.birthDate, "yyyy-MM-dd")}
                            onChange={(e) => formik.setFieldValue("birthdate", e.target.valueAsDate)}
                        />
                    </div>

                    <div className="self-end flex flex-wrap justify-around w-full">
                        <Button htmlType="submit" type="primary" className="mt-5" icon="save">
                            Enregistrer
                        </Button>
                        {student &&
                        <>
                            <Button type="primary" className="mt-5" icon="audit" onClick={archive}>
                                {student.archived ? "Désarchiver" : "Archiver"}
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
};

export default StudentEditor;