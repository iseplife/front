import React, {useEffect, useState} from "react";
import {getStudent} from "../../data/student";
import {Button, Icon, Input, InputNumber, message, Modal, Upload} from "antd";
import Loading from "../Common/Loading";
import {useFormik} from "formik";
import "./Student.css"
import {Student} from "../../data/student/types";
import {Link} from "react-router-dom";
import {format} from "date-fns";

const {confirm} = Modal;


interface StudentEditorProps {
    id?: string
}

interface StudentFields {
    id: number,
    promo: string,
    firstName: string,
    lastName: string,
    birthDate?: Date,
    mail?: string,
    thumbnail?: File
}

const DEFAULT_USER = {
    id: 0,
    promo: new Date().getFullYear().toString(),
    firstName: "",
    lastName: "",
    mail: ""
};


const StudentEditor: React.FC<StudentEditorProps> = ({id}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [student, setStudent] = useState<Student>();
    const [thumbnail, setThumbnail] = useState<string>();
    const [uploading, setUploading] = useState<boolean>();

    const formik = useFormik<StudentFields>({
        initialValues: DEFAULT_USER,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

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
                        <Button type="primary" className="mt-5" icon="save">
                            Enregistrer
                        </Button>
                        {student &&
                        <>
                            <Button type="primary" className="mt-5" icon="audit">
                                Archiver
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