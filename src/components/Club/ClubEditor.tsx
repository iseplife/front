import React, {useCallback, useEffect, useState} from "react"
import {Button, Divider, Input, message, Modal, Select} from "antd"
import {useTranslation} from "react-i18next"
import {Link, useHistory} from "react-router-dom"
import {useFormik} from "formik"
import {Club, ClubAdminForm} from "../../data/club/types"
import {createClub, deleteClub, getClub, getClubAdmins, toggleClubArchiveStatus, updateClubAdmin, uploadClubLogo} from "../../data/club"
import ClubType, {ClubTypeArray} from "../../constants/ClubType"
import ImagePicker from "../Common/ImagePicker"
import Loading from "../Common/Loading"
import StudentSelector from "../Student/StudentSelector"
import {StudentPreview} from "../../data/student/types"
import {format} from "date-fns"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {faArchive, faLink, faTimes} from "@fortawesome/free-solid-svg-icons"
import {faSave, faTrashAlt} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faFacebookF, faInstagram} from "@fortawesome/free-brands-svg-icons"

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
}

const ClubEditor: React.FC<ClubEditorProps> = ({id, onUpdate, onArchive, onDelete, onCreate}) => {
    const {t} = useTranslation()
    const history = useHistory()
    const [loading, setLoading] = useState<boolean>(false)
    const [club, setClub] = useState<Club>()
    const [admins, setAdmins] = useState<StudentPreview[]>()

    const formik = useFormik<ClubAdminForm>({
        initialValues: DEFAULT_CLUB,
        enableReinitialize: true,
        onSubmit: async (values) => {
            // If feed is defined then we are editing a feed, otherwise we are creating a new feed
            let res
            if (club) {
                const {logo, ...form} = values

                res = await updateClubAdmin(club.id, form)
                if (res.status === 200) {
                    const newClub = res.data
                    onUpdate(res.data)
                    setClub(newClub)

                    message.success("Modifications enregistrées !")
                }
                if (logo) {
                    res = await uploadClubLogo(club.id, logo)
                    if (res.status === 200) {
                        club.logoUrl = res.data.name
                    } else {
                        message.error("Un problème lors de l'envoi du logo a été rencontré.")
                    }
                }
            } else {
                const {logo, ...form} = values

                res = await createClub(form)
                if (res.status === 200) {
                    const newClub = res.data
                    if (logo) {
                        res = await uploadClubLogo(res.data.id, logo)
                        if (res.status === 200) newClub.logoUrl = res.data.name
                    }
                    onCreate(newClub)
                    setClub(newClub)
                    history.push(`/admin/club/${newClub.id}`)
                    message.success("Association créée !")
                }
            }
        }
    })

    /**
     * Get club's information according with the id props,
     * this effect is triggered at each new id update.
     */
    useEffect(() => {
        if (id !== undefined) {
            if (+id) {
                setLoading(true)
                getClub(+id).then(res => {
                    if (res.status === 200) {
                        res.data.logoUrl = process.env.PUBLIC_URL+"/img/takeover/asso/ludisep.jpg"
                        setClub(res.data)
                        formik.setValues({
                            ...res.data,
                            admins: [],
                            creation: new Date(res.data.creation)
                        })
                    } else {
                        message.error("Club inconnu: " + id)
                        history.push("/admin/club")
                    }
                }).finally(() => setLoading(false))

                getClubAdmins(+id).then(res => {
                    if (res.status === 200) {
                        setAdmins(res.data)
                        formik.setFieldValue("admins", res.data.map(s => s.id))
                    } else {
                        message.error("Impossible de récupérer les admins ")
                    }
                })
            } else {
                message.error("Club inconnu: " + id)
                history.push("/admin/club")
            }
        } else {
            setAdmins([])
            setClub(undefined)
            formik.resetForm()
        }
    }, [id])

    const handleImage = (file: File | null) => {
        formik.setFieldValue("logo", file)
        if (!file) {
            //formik.setFieldValue('resetLogo', true)
        }
    }

    const remove = useCallback(() =>
        Modal.confirm({
            title: t("remove_item.title"),
            content: t("remove_item.content"),
            okText: t("common:delete"),
            cancelText: t("cancel"),
            onOk: async () => {
                const res = await deleteClub(club!.id)
                if (res.status === 200) {
                    onDelete(club!.id)
                    message.info(t("remove_item.complete"))
                    history.push("/admin/club")
                }
            }
        }), [onDelete, club, t])

    const archive = useCallback(() => {
        // Tell TS that student is always defined when calling this function
        Modal.confirm({
            title: t(`archive_group.${+club!.archived}.title`),
            content: t(`archive_group.${+club!.archived}.content`),
            okText: "Ok",
            cancelText: t("cancel"),
            onOk: async () => {
                const res = await toggleClubArchiveStatus(club!.id)
                if (res.status === 200) {
                    club!.archived = res.data
                    onArchive(club!)
                    message.info(t(`archive_group.${+club!.archived}.complete`))
                }
            }
        })
    }, [onArchive, club, t])

    return (
        <div
            className="flex flex-col items-center bg-white shadow rounded-lg w-full md:w-1/3 mx-2 p-6 sticky"
            style={{height: "min-content", minHeight: "20rem", top: "1.5rem"}}
        >
            {loading ?
                <Loading size="4x"/> :
                <form className="relative flex flex-col w-full" onSubmit={formik.handleSubmit}>

                    <div className="flex flex-col absolute left-0 top-0 w-28">
                        <label >Type</label>
                        <Select
                            bordered={false}
                            className="border-none"
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
                    {club && (
                        <Link to="/admin/club" className="absolute -right-3 -top-3">
                            <FontAwesomeIcon icon={faTimes} size="sm"/>
                        </Link>
                    )}

                    <ImagePicker onChange={handleImage} defaultImage={mediaPath(club?.logoUrl, AvatarSizes.DEFAULT)} className="mt-5 avatar-uploader"/>

                    <div className="flex justify-between mx-3">
                        <div className="w-1/2">
                            <label >Nom de l'association</label>
                            <Input
                                required
                                placeholder="Nom"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                        </div>
                        <div className="w-2/5">
                            <label >Date de création</label>
                            <Input
                                name="creation"
                                type="date"
                                value={format(formik.values.creation, "yyyy-MM-dd")}
                                onChange={(e) => formik.setFieldValue("creation", e.target.valueAsDate)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 mx-3 ">
                        <label >Description</label>
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
                        <label >Administrateurs</label>
                        <StudentSelector
                            placeholder="Aucun administrateur (déconseillé)"
                            className="w-full"
                            defaultValues={admins}
                            onChange={(ids) => formik.setFieldValue("admins", ids)}
                        />
                    </div>
                    }

                    <div className="flex mx-3 mt-3 mb-5">
                        <div className="flex-1 mx-1">
                            <label >Site Internet</label>
                            <Input
                                name="website"
                                placeholder="Lien site internet"
                                suffix={<FontAwesomeIcon icon={faLink}/>}/>
                        </div>
                        <div className="flex-1 mx-1">
                            <label >Instagram</label>
                            <Input
                                name="instagram"
                                placeholder="Lien Instagram"
                                suffix={<FontAwesomeIcon icon={faInstagram}/>}/>
                        </div>
                        <div className="flex-1 mx-1">
                            <label >Facebook</label>
                            <Input
                                name="facebook"
                                placeholder="Lien Facebook"
                                suffix={<FontAwesomeIcon icon={faFacebookF}/>}
                            />
                        </div>
                    </div>

                    <div className="self-end flex flex-wrap justify-around w-full">
                        <Button
                            htmlType="submit"
                            className="mt-5 text-white rounded border-green-500 bg-green-500"
                            icon={<FontAwesomeIcon icon={faSave} className="mr-2"/>}
                        >
                            Enregistrer
                        </Button>
                        {club && (
                            <>
                                <Button className="mt-5 text-white rounded border-yellow-500 bg-yellow-500" icon={<FontAwesomeIcon icon={faArchive} className="mr-2"/>} onClick={archive}>
                                    {club.archived ? "Désarchiver" : "Archiver"}
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

export default ClubEditor
