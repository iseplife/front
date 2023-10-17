import React, {useCallback, useContext, useRef, useState} from "react"
import {Button, message} from "antd"
import {useTranslation} from "react-i18next"
import {uploadCover} from "../../../data/club"
import {ClubContext} from "../../../context/club/context"
import {faCircleNotch, faPencilAlt, faSave, faUndo} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons"
import {mediaPath} from "../../../util"
import {ClubActionType} from "../../../context/club/action"
import {CoverSizes} from "../../../constants/MediaSizes"

const ClubCover: React.FC = () => {
    const {t} = useTranslation()
    const [preview, setPreview] = useState<string>()
    const [image, setImage] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const {state: {club}, dispatch} = useContext(ClubContext)
    const uploadRef = useRef<HTMLInputElement>(null)

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const reader = new FileReader()
            reader.onload = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(e.target.files[0])
            setImage(e.target.files[0])
        }
    }, [])

    const undoChange = useCallback(() => {
        setImage(null)
        setPreview(undefined)
    }, [])

    const updateCover = useCallback(() => {
        if (image) {
            setUploading(true)
            uploadCover(club!.id, image).then( res => {
                dispatch({type: ClubActionType.UPDATE_COVER, payload: res.data.name})
                message.success("image mise à jour")

                setImage(null)
            }).finally(() => setUploading(false))
        }
    }, [club, image])

    const removeCover = useCallback(() => {
        uploadCover(club!.id, null).then(() => {
            dispatch({type: ClubActionType.UPDATE_CLUB, payload: {...club!, coverUrl: undefined}})
            message.success("image supprimé")
        })
    }, [club])


    return (
        <div className="w-full md:h-64 h-28 relative">
            <input type="file" hidden onChange={handleChange} ref={uploadRef}/>
            {image && (
                <div className="absolute" style={{bottom: 5, right: 5}}>
                    <Button
                        className="mx-1 text-white rounded border-red-500 bg-red-500"
                        onClick={undoChange}
                    >
                        {t("undo")} <FontAwesomeIcon icon={faUndo} className="ml-1"/>
                    </Button>
                    <Button
                        className="mx-1 text-white rounded border-green-500 bg-green-500"
                        onClick={updateCover}
                    >
                        {t("save")}
                        {uploading ?
                            <FontAwesomeIcon icon={faCircleNotch} spin className="ml-1"/> :
                            <FontAwesomeIcon icon={faSave} className="ml-1"/>
                        }
                    </Button>
                </div>
            )}
            <div className="bg-neutral-300 animate-pulse w-hull h-full absolute inset-0" />
            <div
                className="w-full h-full absolute inset-0"
                style={{
                    backgroundImage: `url("${preview || mediaPath(club?.coverUrl, CoverSizes.DEFAULT) || "img/static/default-cover.png"}")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            {club?.canEdit && !image && (
                <div className="absolute flex top-4 right-4">
                    {club?.coverUrl && (
                        <div
                            onClick={removeCover}
                            className="text-xl flex w-10 h-10 justify-center items-center rounded-full bg-black/20 hover:bg-black/30 transition-colors cursor-pointer group"
                        >
                            <FontAwesomeIcon
                                className="cursor-pointer text-red-400 text-opacity-80 mx-1 group-hover:text-opacity-100 transition-colors"
                                icon={faTrashAlt}
                            />
                        </div>
                    )}
                    <div
                        onClick={() => uploadRef.current?.click()}
                        className="ml-2 text-xl flex w-10 h-10 justify-center items-center rounded-full bg-black/20 hover:bg-black/30 transition-colors cursor-pointer group"
                    >
                        <FontAwesomeIcon
                            className="cursor-pointer text-neutral-300 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors"
                            icon={faPencilAlt}
                        />
                    </div>

                </div>
            )}
        </div>
    )
}

export default ClubCover
