import React, {useCallback, useMemo} from "react"
import {Avatar, Badge, message, Modal, Select} from "antd"
import {mediaPath} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {ClubMember, ClubMemberForm, ClubRoleIcon, ClubRoles} from "../../../data/club/types"
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons"
import {useTranslation} from "react-i18next"
import {deleteClubMember, updateClubMember} from "../../../data/club"
import {faCheck, faUndo} from "@fortawesome/free-solid-svg-icons"
import {Field, Form, Formik} from "formik"

const {Option} = Select

type ClubMemberEditorProps = {
    m: ClubMember
    onDelete: (id: number) => void
    onUpdate: (member: ClubMember) => void
}
const ClubMemberEditor: React.FC<ClubMemberEditorProps> = ({m, onUpdate, onDelete}) => {
    const {t} = useTranslation(["common", "club"])
    const initialValues: ClubMemberForm = useMemo(() => ({
        position: m.position,
        role: m.role
    }), [m.role, m.position])

    const confirmDelete = useCallback(() => {
        Modal.confirm({
            title: t("remove_item.title"),
            content: t("remove_item.content"),
            okText: "Ok",
            cancelText: t("cancel"),
            onOk: async () => {
                const res = await deleteClubMember(m.id)
                if (res.status === 200) {
                    onDelete(m.id)
                    message.info(t("remove_item.complete"))
                }
            }
        })
    }, [m.id, onDelete])

    const updateMember = useCallback((values: ClubMemberForm) => {
        updateClubMember(m.id, values).then(res => {
            onUpdate(res.data)
        })
    }, [m.id, onUpdate])

    return (
        <Formik onSubmit={updateMember} initialValues={initialValues}>
            {({values, resetForm, setFieldValue, setSubmitting}) => (
                <Badge count={
                    <span className="top-1 right-5">
                        {values == initialValues ?
                            <FontAwesomeIcon
                                onClick={confirmDelete}
                                icon={faTrashAlt}
                                className="cursor-pointer shadow-md bg-red-600 hover:bg-red-700 p-1.5 rounded-full text-white h-6 w-6"
                            /> :
                            <>
                                <FontAwesomeIcon
                                    onClick={() => resetForm({values: initialValues})}
                                    icon={faUndo}
                                    className="cursor-pointer shadow-md bg-white hover:bg-gray-300 p-1.5 mr-1 rounded-full text-gray-600 h-6 w-6"
                                />
                                <FontAwesomeIcon
                                    onClick={() => setSubmitting(true)}
                                    icon={faCheck}
                                    className="cursor-pointer shadow-md bg-green-600 hover:bg-green-700 p-1.5 rounded-full text-white h-6 w-6"
                                />
                            </>
                        }
                    </span>
                }>
                    <div
                        title={m.student.firstName + " " + m.student.lastName}
                        className="h-20 w-full sm:h-60 sm:w-44 p-2 sm:p-3 pb-2 m-2 shadow-md flex sm:flex-col flex-row items-center bg-white rounded-lg overflow-hidden"
                    >
                        <Avatar
                            src={mediaPath(m.student.picture, AvatarSizes.DEFAULT)}
                            alt={m.student.firstName + " " + m.student.lastName}
                            shape="square"
                            className="sm:w-full h-full w-1/3 rounded-lg"
                        />
                        <div className="sm:text-center text-left mt-0 ml-2 sm:mt-2 sm:ml-0 w-2/3 sm:w-full">
                            <h5 className="font-bold text-xl mb-0 truncate">
                                {m.student.firstName + " " + m.student.lastName}
                            </h5>
                            <Form className="flex justify-around text-md text-gray-500">
                                <Field
                                    name="position"
                                    className="w-3/5 mr-1 font-bold focus:text-gray-600 focus:outline-none border-b"
                                />
                                <Select
                                    defaultValue={values.role}
                                    onChange={value => setFieldValue("role", value)}
                                >
                                    {ClubRoles.map(r =>
                                        <Option key={r} value={r}>
                                            <FontAwesomeIcon
                                                className="ml-1"
                                                icon={ClubRoleIcon[r]}
                                                title={t("club:role." + r)}
                                            />
                                        </Option>
                                    )}
                                </Select>
                            </Form>
                        </div>
                    </div>
                </Badge>
            )}
        </Formik>
    )
}

export default ClubMemberEditor
