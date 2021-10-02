import React, {useCallback, useLayoutEffect, useState} from "react"
import {createStudent, deleteCustomPicture, updateOriginalPicture, updateStudentAdmin} from "../../data/student"
import {Avatar, Button, Divider, Input, InputNumber, message, Modal, Select} from "antd"
import Loading from "../Common/Loading"
import {Form, FormikProps, withFormik} from "formik"
import {StudentAdmin, StudentPicture} from "../../data/student/types"
import {format} from "date-fns"
import ImagePicker from "../Common/ImagePicker"
import {Role} from "../../data/security/types"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSave, faUser} from "@fortawesome/free-regular-svg-icons"
import {getRoles} from "../../data/security"
import {useTranslation} from "react-i18next"

const {Option} = Select


const StudentEditionForm: React.FC<FormikProps<StudentAdminEditionForm>> = ({values, setFieldValue, handleChange, }) => {
    const {t} = useTranslation()
    const [roles, setRoles] = useState<Role[]>()
    const handleImage = useCallback((file: File | null) => {
        setFieldValue("picture", file)
        if (!file) {
            setFieldValue("resetPicture", true)
        }
    }, [])

    const deleteCustom = useCallback(() =>
        Modal.confirm({
            title: t("remove_item.title"),
            content: t("remove_item.content"),
            okText: "Ok",
            cancelText: t("cancel"),
            onOk: async () => {
                const id = values.id
                const res = await deleteCustomPicture(id)
                if (res.status === 200) {
                    message.info(t("remove_item.complete"))
                    setFieldValue("pictures", {
                        custom: undefined,
                        original: values.pictures?.original
                    })
                }
            }
        }), [values.id])

    useLayoutEffect(() => {
        getRoles().then(res => {
            if (res.status) {
                setRoles(res.data)
            }
        })
    }, [])

    return (
        <Form>
            <ImagePicker
                onChange={handleImage}
                defaultImage={mediaPath(values.pictures?.original, AvatarSizes.DEFAULT)}
                className="avatar-uploader"
            />

            {values.pictures?.custom && (
                <div className="text-center">
                    <span className="text-center no-underline mr-3">
                        <Avatar
                            src={mediaPath(values.pictures?.custom, AvatarSizes.THUMBNAIL)}
                            icon={<FontAwesomeIcon icon={faUser} />}
                            alt={values.firstName + " " + values.lastName}
                            size="default"
                            className="hover:shadow-outline "
                        />
                    </span>
                    <span className="block text-red-600 font-dinot cursor-pointer" onClick={deleteCustom}>
                            Supprimer photo perso
                    </span>
                </div>
            )}

            <div className="flex justify-between mb-2 mt-4">
                <label className="font-semibold">Numéro étudiant :</label>
                <InputNumber
                    required
                    name="id"
                    className="border-none pl-1"
                    formatter={(val = 0) => val.toString().padStart(4, "0")}
                    value={values.id}
                    onChange={(val) => setFieldValue("id", val)}
                />
            </div>

            <div className="flex justify-between mb-4">
                <label className="font-semibold">Promotion :</label>
                <InputNumber
                    className="border-none pl-1"
                    name="promo"
                    value={values.promo}
                    onChange={(val) => setFieldValue("promo", val)}
                />
            </div>

            <div className="flex flex-row mb-4">
                <div className="mr-2 w-1/2">
                    <label className="font-semibold">Prénom</label>
                    <Input
                        required
                        placeholder="Dieudonné"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                    />
                </div>
                <div className="ml-2 w-1/2">
                    <label className="font-semibold">Nom</label>
                    <Input
                        required
                        placeholder="Abboud"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div>
                <label className="font-semibold">Roles</label>
                <Select
                    className="w-full"
                    mode="multiple"
                    value={values.roles}
                    notFoundContent={roles ? <Loading size="sm"/> : null}
                    onChange={(val: string[]) => setFieldValue("roles", val)}
                >
                    {roles && roles.map(r => (
                        <Option key={r.id} value={r.role}>{r.role}</Option>
                    ))}
                </Select>
            </div>

            <Divider/>

            <div className="flex justify-between mb-4">
                <div className="mr-1">
                    <label className="font-semibold">Email</label>
                    <Input
                        placeholder="dieudonne.abboud@isep.fr"
                        name="mail"
                        value={values.mail}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="mb-5">
                <label className="font-semibold">Date de naissance</label>
                <Input
                    placeholder="29/01/1968"
                    name="birthDate"
                    type="date"
                    value={values.birthDate && format(values.birthDate, "yyyy-MM-dd")}
                    onChange={(e) => setFieldValue("birthDate", e.target.valueAsDate)}
                />
            </div>

            <div className="self-end flex flex-wrap justify-around w-full">
                <Button
                    htmlType="submit"
                    className="mt-5 text-white rounded border-green-500 bg-green-500"
                    icon={<FontAwesomeIcon icon={faSave} className="mr-2"/>}
                >
                    Enregistrer
                </Button>
            </div>
        </Form>)
}


const DEFAULT_USER = {
    id: 0,
    roles: ["ROLE_STUDENT"],
    promo: new Date().getFullYear(),
    firstName: "",
    lastName: "",
}

export type StudentAdminEditionForm = {
    id: number
    promo: number
    roles: string[]
    firstName: string
    lastName: string
    birthDate?: Date
    mail?: string
    picture?: File
    pictures?: StudentPicture
}

type StudentEditorFormProps = {
    student?: StudentAdmin
    onSubmit: (student: StudentAdmin) => void
}

const StudentEditorForm = withFormik<StudentEditorFormProps, StudentAdminEditionForm>({
    mapPropsToValues: ({student}) => student ?
        ({
            id: student.id,
            roles: student.roles,
            promo: student.promo,
            firstName: student.firstName,
            lastName: student.lastName,
            mail: student.mail,
            pictures: student.pictures,
            birthDate: student.birthDate ? new Date(student.birthDate) : undefined
        }) : DEFAULT_USER
    ,

    handleSubmit: async (values, {props}) => {
        const {picture, pictures, ...form} = values

        // If student is defined then we are editing an user, otherwise we are creating an user
        let student = props.student
        if (student) {
            student = (await updateStudentAdmin(form)).data
            if(pictures) student.pictures = pictures

            message.success("Modifications enregistrées !")
        } else {
            student = (await createStudent(form)).data
            message.success("Modifications enregistrées !")
        }

        if (picture) {
            const res = await updateOriginalPicture(student.id , picture)
            if (res.status === 200) {
                student.pictures = res.data
            } else {
                message.error("Un problème lors de l'envoi de la photo a été rencontré.")
            }
        }

        props.onSubmit(student)
    },
    displayName: "StudentEditorForm",
})(StudentEditionForm)

export default StudentEditorForm
