import React, {useCallback, useEffect, useMemo, useState} from "react"
import {Button, Divider, Input, message, Modal, Switch} from "antd"
import {useTranslation} from "react-i18next"
import {Link, useHistory} from "react-router-dom"
import {GroupAdmin, GroupForm} from "../../data/group/types"
import {useFormik} from "formik"
import Loading from "../Common/Loading"
import ImagePicker from "../Common/ImagePicker"
import StudentSelector from "../Student/StudentSelector"
import HelperIcon from "../Common/HelperIcon"
import {createGroup, deleteGroup, getGroupAdmin, toggleGroupArchiveStatus, updateGroup, uploadGroupCover} from "../../data/group"
import {StudentPreview} from "../../data/student/types"
import "./GroupEditor.css"
import {mediaPath} from "../../util"
import {faArchive, faLock, faTimes, faUnlock} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faSave, faTrashAlt} from "@fortawesome/free-regular-svg-icons"


type GroupEditorProps = {
    id?: string,
    onDelete: (id: number) => void
    onArchive: (feed: GroupAdmin) => void
    onCreate: (feed: GroupAdmin) => void
    onUpdate: (feed: GroupAdmin) => void
}

const DEFAULT_GROUP = {
    id: 0,
    restricted: false,
    name: "",
    admins: []
}

const GroupEditor: React.FC<GroupEditorProps> = ({id, onCreate, onDelete, onArchive, onUpdate}) => {
    const {t} = useTranslation()
    const history = useHistory()
    const [loading, setLoading] = useState<boolean>(false)
    const [group, setGroup] = useState<GroupAdmin>()
    const admins = useMemo(() => group?.admins.reduce((acc: StudentPreview[], curr) => {
        if (curr.admin)
            acc.push(curr.student)
        return acc
    }, []), [group])

    const formik = useFormik<GroupForm>({
        initialValues: DEFAULT_GROUP,
        onSubmit: async (values) => {
            // If feed is defined then we are editing a feed, otherwise we are creating a new feed
            let res
            if (group) {
                const {cover, ...form} = values
                res = await updateGroup(group.id, form)
                if (res.status === 200) {
                    onUpdate(res.data)
                    setGroup(res.data)
                    message.success("Modifications enregistrées !")
                }
                if (cover) {
                    res = await uploadGroupCover(group.id, cover)
                    if (res.status === 200) {
                        group.cover = res.data.name
                    } else {
                        message.error("Un problème lors de l'envoi de la couverture a été rencontré.")
                    }
                }
            } else {
                const {cover, ...form} = values

                res = await createGroup(form)
                if (res.status === 200) {
                    const newGroup = res.data
                    if (cover) {
                        res = await uploadGroupCover(newGroup.id, cover)
                        if (res.status === 200) newGroup.cover = res.data.name
                    }
                    onCreate(newGroup)
                    setGroup(newGroup)
                    history.push(`/admin/group/${newGroup.id}`)
                    message.success("Groupe créé !")
                }
            }
        },
    })


    /**
     * Get group's information according with the id props,
     * this effect is triggered at each new id update.
     */
    useEffect(() => {
        if (id !== undefined) {
            if (+id) {
                setLoading(true)
                getGroupAdmin(+id).then(res => {
                    if (res.status === 200) {
                        setGroup(res.data)
                        formik.setValues({
                            name: res.data.name,
                            restricted: res.data.restricted,
                            admins: res.data.admins.reduce((acc: number[], curr) => {
                                if (curr.admin)
                                    acc.push(curr.student.id)
                                return acc
                            }, [])
                        })
                    } else {
                        message.error("Groupe inconnu: " + id)
                        history.push("/admin/group")
                    }
                }).finally(() => setLoading(false))
            } else {
                message.error("Groupe inconnu: " + id)
                history.push("/admin/group")
            }
        } else {
            setGroup(undefined)
            formik.resetForm()
        }
    }, [id])


    const remove = useCallback(() =>
        Modal.confirm({
            title: t("remove_item.title"),
            content: t("remove_item.content"),
            okText: t("common:delete"),
            cancelText: t("cancel"),
            onOk: async () => {
                const res = await deleteGroup(group!.id)
                if (res.status === 200) {
                    onDelete(group!.id)
                    message.info(t("remove_item.complete"))
                    history.push("/admin/group")
                }
            }
        }), [onDelete, group, t])

    const archive = useCallback(() => {
        // Tell TS that student is always defined when calling this function
        Modal.confirm({
            title: t(`archive_group.${+group!.archived}.title`),
            content: t(`archive_group.${+group!.archived}.content`),
            okText: "Ok",
            cancelText: t("cancel"),
            onOk: async () => {
                const res = await toggleGroupArchiveStatus(group!.id)
                if (res.status === 200) {
                    group!.archived = res.data
                    onArchive(group!)
                    message.info(t(`archive_group.${+group!.archived}.complete`))
                }
            }
        })
    }, [onArchive, group, t])

    return (
        <div
            className="flex flex-col items-center bg-white shadow rounded-lg w-full md:w-1/2 mx-2 p-6 sticky"
            style={{height: "min-content", minHeight: "16rem", top: "1.5rem"}}
        >
            {loading ?
                <Loading size="4x"/> :
                <form className="relative flex flex-col w-full" onSubmit={formik.handleSubmit}>
                    {group && (
                        <Link to="/admin/group" className="absolute -right-3 -top-3">
                            <FontAwesomeIcon icon={faTimes} size="sm" />
                        </Link>
                    )}

                    <ImagePicker className="cover-selector" onChange={file => formik.setFieldValue("cover", file)} defaultImage={mediaPath(group?.cover)}/>

                    <div className="flex mt-5">
                        <div className="flex flex-col mx-3">
                            <label >Groupe privé
                                <HelperIcon
                                    text="Un groupe privé n'est visible et accessible que par les personnes faisant parti de celui-ci"
                                />
                            </label>
                            <Switch
                                className="m-auto"
                                checkedChildren={<FontAwesomeIcon icon={faLock}/>}
                                unCheckedChildren={<FontAwesomeIcon icon={faUnlock} />}
                                checked={formik.values.restricted}
                                onChange={(val) => formik.setFieldValue("restricted", val)}
                            />

                        </div>
                        <div className="flex-1 mx-3">
                            <label >Nom du groupe</label>
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
                        <label >Administrateurs</label>
                        <StudentSelector
                            placeholder="Aucun administrateur (déconseillé)"
                            className="w-full"
                            defaultValues={admins}
                            onChange={(ids) => formik.setFieldValue("admins", ids)}
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
                        {group && (
                            <>
                                <Button className="mt-5 text-white rounded border-yellow-500 bg-yellow-500" icon={<FontAwesomeIcon icon={faArchive} className="mr-2"/>} onClick={archive}>
                                    {group.archived ? "Désarchiver" : "Archiver"}
                                </Button>
                                <Button className="mt-5 rounded" icon={<FontAwesomeIcon icon={faTrashAlt} className="mr-2"/>} onClick={remove} danger>
                                    Supprimer
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            }
        </div>
    )
}

export default GroupEditor
