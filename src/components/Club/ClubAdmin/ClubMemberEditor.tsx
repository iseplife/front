import React, {useCallback, useMemo, useState} from "react"
import {message, Modal, Select} from "antd"
import {mediaPath} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {ClubMember, ClubMemberUpdateForm, ClubRoleIcon, ClubRoles} from "../../../data/club/types"
import {useTranslation} from "react-i18next"
import {deleteClubMember, updateClubMember} from "../../../data/club"
import {Field, Form, Formik, useFormik, useFormikContext} from "formik"
import {faCheck, faFloppyDisk, faPen, faSpinner, faTrashAlt, faUndo, faUser} from "@fortawesome/free-solid-svg-icons"
import LinkEntityPreloader from "../../Optimization/LinkEntityPreloader"
import { Link } from "react-router-dom"

const {Option} = Select
const isValuesUpdated = (a: ClubMemberUpdateForm, b: ClubMemberUpdateForm): boolean => {
    return !(a.role === b.role && a.position === b.position)
}

type ClubMemberEditorProps = {
    m: ClubMember
    onDelete: (id: number) => void
    onUpdate: (member: ClubMember) => void
}
const ClubMemberEditor: React.FC<ClubMemberEditorProps> = ({m, onUpdate, onDelete}) => {

    const [isSubmitting, setIsSubmitting] = useState(false)

    const {t} = useTranslation(["common", "club"])

    const defaultValues: ClubMemberUpdateForm = useMemo(() => ({
        position: m.position,
        role: m.role
    }), [m.role, m.position])

    const confirmDelete = useCallback(() => {
        Modal.confirm({
            title: t("remove_item.title"),
            content: t("remove_item.content"),
            okText: t("common:delete"),
            cancelText: t("cancel"),
            onOk: async () => {
                const res = await deleteClubMember(m.id)
                if (res.status === 200) {
                    onDelete(m.id)
                    message.success(t("remove_item.complete"))
                }
            }
        })
    }, [m.id, onDelete, t])

    const updateMember = useCallback((values: ClubMemberUpdateForm) => {
        updateClubMember(m.id, values).then(res => {
            onUpdate(res.data)
            message.success(t("club:member_updated"))
        })
    }, [m.id, onUpdate, t])

    return (
        <Formik onSubmit={updateMember} initialValues={defaultValues}>
            {({values, setFieldValue}) => (
                (<LinkEntityPreloader noWidth preview={m.student} className="w-1/2 xl:w-1/3 2xl:w-1/4 p-2">
                    <Form className="block w-full rounded-lg shadow-sm">
                        <div
                            className={"relative bg-white rounded-t-lg overflow-hidden aspect-[18/20] w-full px-3.5 items-end flex cursor-pointer bg-[length:112%]"}
                            style={{
                                backgroundImage: `url("${m.student.picture ? mediaPath(m.student.picture, AvatarSizes.FULL) : "img/icons/discovery/user.svg"}")`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="relative w-full">
                                <FontAwesomeIcon
                                    icon={faPen}
                                    className="absolute top-2.5 left-2 z-10 opacity-50 cursor-default pointer-events-none"
                                />
                                <Field name="position" className="pl-7 bg-white/50 rounded-xl text-right backdrop-blur w-full outline-none px-2 py-1 leading-6 mb-3 mt-auto ml-auto text-neutral-900 font-semibold text-sm" />
                            </div>
                        </div>
                        <div className="bg-white rounded-b-lg text-base text-center text-neutral-900 px-2 font-semibold flex flex-col items-center justify-center overflow-hidden">
                            <div className="h-14 flex items-center">
                                <span className="overflow-hidden text-ellipsis line-clamp-2">{m.student.firstName + " " + m.student.lastName}</span>                    
                            </div>

                            <Select
                                className="!rounded-xl w-full mt-2"
                                value={values.role}
                                onChange={value => setFieldValue("role", value)}
                            >
                                {ClubRoles.map(r =>
                                    <Option key={r} value={r}>
                                        
                                        <FontAwesomeIcon
                                            className="mr-2"
                                            icon={ClubRoleIcon[r]}
                                            title={t("club:role." + r)}
                                        />
                                        {t("club:role." + r)}
                                    </Option>
                                )}
                            </Select>

                            <div className="flex w-full p-2 space-x-2 sm:space-x-4 items-center">

                                <button type="button">
                                    <FontAwesomeIcon
                                        onClick={confirmDelete}
                                        icon={faTrashAlt}
                                        className="text-red-400 hover:text-red-600 duration-100"
                                    />
                                </button>                            

                                <div className="w-full"></div>
                               
                                {isSubmitting ?
                                    <FontAwesomeIcon
                                        icon={faSpinner}
                                        spin
                                        inverse
                                        className="text-orane"
                                    /> :
                                    <button type="submit">
                                        <FontAwesomeIcon
                                            icon={faFloppyDisk}
                                            className="text-[#fe9200] hover:text-[#d66f02] duration-100"
                                        />
                                    </button>
                                }

                            </div>
                        </div>
                    </Form>
                </LinkEntityPreloader>)
                       
            )}
        </Formik>
    )
}

export default ClubMemberEditor
