import React, {useCallback, useEffect, useState} from "react"
import {
    deleteCustomPicture,
    deleteStudent, getStudentAdmin,
    toggleStudentArchiveStatus,
} from "../../data/student"
import {message, Modal,} from "antd"
import Loading from "../Common/Loading"
import {Student, StudentAdmin} from "../../data/student/types"
import {Link, useHistory} from "react-router-dom"
import {useTranslation} from "react-i18next"
import {faArchive, faLock, faTimes} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons"
import StudentEditorForm from "./StudentEditorForm"


type StudentEditorProps = {
    id?: string
    onDelete: (id: number) => void
    onArchive: (student: StudentAdmin) => void
    onCreate: (student: StudentAdmin) => void
    onUpdate: (student: StudentAdmin) => void
}

const StudentEditor: React.FC<StudentEditorProps> = ({id, onDelete, onArchive, onCreate, onUpdate}) => {
    const {t} = useTranslation()
    const history = useHistory()
    const [loading, setLoading] = useState<boolean>(false)
    const [student, setStudent] = useState<StudentAdmin>()

    /**
     * Get student information according with the id props,
     * this effect is triggered at each new id update.
     */
    useEffect(() => {
        if (id !== undefined) {
            if (+id) {
                setLoading(true)
                getStudentAdmin(+id).then(res => {
                    if (res.status === 200) {
                        setStudent(res.data)
                    } else {
                        message.error("Utilisateur inconnu: " + id)
                        history.push("/admin/user")
                    }
                }).finally(() => setLoading(false))
            } else {
                message.error("Utilisateur inconnu: " + id)
                history.push("/admin/user")
            }
        } else {
            setStudent(undefined)
        }
    }, [id])


    const remove = useCallback(() =>
        Modal.confirm({
            title: t("remove_item.title"),
            content: t("remove_item.content"),
            okText: t("delete"),
            cancelText: t("cancel"),
            onOk: async () => {
                const id = (student as Student).id
                const res = await deleteStudent(id)
                if (res.status === 200) {
                    onDelete(id)
                    message.info(t("remove_item.complete"))
                    history.push("/admin/user")
                }
            }
        }), [onDelete, student, t])

    const archive = useCallback(() => {
        // Tell TS that student is always defined when calling this function
        Modal.confirm({
            title: t(`archive_user.${+student!.archived}.title`),
            content: t(`archive_user.${+student!.archived}.content`),
            okText: "Ok",
            cancelText: t("cancel"),
            onOk: async () => {
                const res = await toggleStudentArchiveStatus(student!.id)
                if (res.status === 200) {
                    student!.archived = res.data
                    onArchive(student!)
                    message.info(t(`archive_user.${+student!.archived}.complete`))
                }
            }
        })
    }, [onArchive, student, t])

    return (
        <div
            className="flex flex-col items-center bg-white shadow rounded-lg w-full md:w-1/3 mx-2 p-6 sticky"
            style={{height: "min-content", minHeight: "16rem", top: "1.5rem"}}
        >
            {loading ?
                <Loading size="4x"/> :
                <div className="relative flex flex-col">
                    <div className="absolute left-0 top-0 w-16">
                        {student?.archived &&
                        <div className="flex items-center text-red-600 font-bold">
                            <FontAwesomeIcon icon={faLock} className="mr-1"/> ARCHIVÉ
                        </div>
                        }

                    </div>
                    {student && (
                        <div className="absolute -right-3 -top-3">
                            <FontAwesomeIcon
                                icon={faArchive}
                                className="cursor-pointer mx-2 text-yellow-500 hover:text-yellow-300"
                                onClick={archive}
                            />
                            <FontAwesomeIcon
                                icon={faTrashAlt}
                                className="cursor-pointer mr-4 text-red-500 hover:text-red-300"
                                onClick={remove}
                            />
                            <Link to="/admin/user">
                                <FontAwesomeIcon icon={faTimes} size="sm"/>
                            </Link>
                        </div>
                    )}
                    <StudentEditorForm student={student} onSubmit={student ? onCreate : onUpdate}/>
                </div>
            }
        </div>
    )
}

export default StudentEditor
