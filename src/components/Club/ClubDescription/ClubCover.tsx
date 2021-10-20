import React, {useCallback, useContext, useRef, useState} from "react"
import {Button, message} from "antd"
import {useTranslation} from "react-i18next"
import {uploadCover} from "../../../data/club"
import {ClubContext} from "../../../context/club/context"
import {faPencilAlt, faSave, faUndo} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons"
import {mediaPath} from "../../../util"

const ClubCover: React.FC = () => {
    const {t} = useTranslation()
    const [preview, setPreview] = useState<string>()
    const [image, setImage] = useState<File>()
    const {state: {club: {data: club}}} = useContext(ClubContext)
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
        setImage(undefined)
        setPreview(undefined)
    }, [])

    const updateCover = useCallback(() => {
        if (club?.id && image) {
            uploadCover(club.id, image).then(() => {
                message.success("image mise à jour")
            })
        }
    }, [club, image])

    const removeCover = useCallback(() => {
        if (club?.id) {
            uploadCover(club.id, null).then(() => {
                message.success("image supprimé")
            })
        }
    }, [club])



    return (
        <div className="w-full md:h-40 h-24 relative">
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
                        {t("save")} <FontAwesomeIcon icon={faSave} className="ml-1"/>
                    </Button>
                </div>
            )}
            <div
                className="w-full h-full"
                style={{
                    backgroundImage: `url("${preview || mediaPath(club?.coverUrl || "img/static/default-cover.png")}")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            {club?.canEdit && !image && (
                <div className="absolute top-4 right-4">
                    {club?.coverUrl && (
                        <div
                            onClick={removeCover}
                            className="text-xl flex w-10 h-10 justify-center items-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer group"
                        >
                            <FontAwesomeIcon
                                className="cursor-pointer mr-4 text-red-500 hover:text-red-300"
                                icon={faTrashAlt}
                            />
                        </div>
                    )}
                    <div
                        onClick={() => uploadRef.current?.click()}
                        className="text-xl flex w-10 h-10 justify-center items-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer group"
                    >
                        <FontAwesomeIcon
                            className="cursor-pointer text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors"
                            icon={faPencilAlt}
                        />
                    </div>

                </div>
            )}
        </div>
    )
}

export default ClubCover
