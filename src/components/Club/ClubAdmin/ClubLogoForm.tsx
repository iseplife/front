import React, {useCallback, useContext, useMemo, useState} from "react"
import ImagePicker from "../../Common/ImagePicker"
import {Button, message} from "antd"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCircleNotch, faSave} from "@fortawesome/free-solid-svg-icons"
import {useTranslation} from "react-i18next"
import {mediaPath} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import {uploadClubLogo} from "../../../data/club"
import {ClubContext, ClubContextWithClub} from "../../../context/club/context"
import {ClubActionType} from "../../../context/club/action"

const ClubLogoForm: React.FC = () => {
    const {t} = useTranslation(["common", "club"])
    const {state: { club }, dispatch} = useContext(ClubContext) as ClubContextWithClub
    const [image, setImage] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const defaultImage = useMemo(() => (
        club.logoUrl.startsWith("data:image") ?
            club.logoUrl :
            mediaPath(club.logoUrl, AvatarSizes.DEFAULT)
    ), [club.logoUrl])

    const updateChange = useCallback(() => {
        if (image !== null) {
            setUploading(true)
            uploadClubLogo(club.id, image).then(res => {
                if (res.status === 200) {
                    const reader = new FileReader()
                    reader.onload = () => {
                        dispatch({type: ClubActionType.UPDATE_LOGO, payload: reader.result as string})
                        message.success(t("club:logo_updated"))
                    }
                    reader.readAsDataURL(image)
                } else {
                    message.error(t("club:logo_update_failed"))
                }
                setImage(null)
            }).finally(() => setUploading(false))
        }
    }, [image])

    const handleChange = useCallback((file: File | null) => {
        setImage(file)
    }, [])

    return (
        <div className="relative flex flex-col items-center rounded-lg shadow bg-white p-3 m-2 w-full">
            <h3 className="font-bold text-xl text-gray-600 self-start">Edition logo</h3>
            <ImagePicker
                className="avatar-uploader-large mt-5 flex-grow"
                defaultImage={defaultImage}
                onChange={handleChange}
                onReset={() => setImage(null)}
            />
            {image && (
                <div className="w-full text-right">
                    <Button
                        className="text-white rounded border-green-500 bg-green-500"
                        disabled={uploading}
                        onClick={updateChange}
                    >
                        {t("save")}
                        {uploading ?
                            <FontAwesomeIcon icon={faCircleNotch} spin className="ml-1"/> :
                            <FontAwesomeIcon icon={faSave} className="ml-1"/>
                        }
                    </Button>
                </div>
            )}
        </div>
    )
}
export default ClubLogoForm
