import React, {useCallback, useContext, useState} from "react"
import ImagePicker from "../../Common/ImagePicker"
import {Button, message} from "antd"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faSave} from "@fortawesome/free-solid-svg-icons"
import {useTranslation} from "react-i18next"
import {mediaPath} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import {uploadClubLogo} from "../../../data/club"
import {ClubContext} from "../../../context/club/context"
import {ClubActionType} from "../../../context/club/action"
import {Club} from "../../../data/club/types"

type ClubLogoFormProps = {

}
const ClubLogoForm: React.FC<ClubLogoFormProps> = () => {
    const {t} = useTranslation(["common", "club"])
    const {state: {club: {data}}, dispatch} = useContext(ClubContext)
    const [image, setImage] = useState<File | null>(null)

    const updateChange = useCallback(() => {
        const club = data as Club
        if (club.id && image !== undefined) {
            uploadClubLogo(club.id, image).then(res => {
                if (res.status === 200) {
                    dispatch({type: ClubActionType.UPDATE_CLUB, payload: {...club, logoUrl: res.data}})
                    message.success(t("logo_updated"))
                } else {
                    message.error(t("logo_update_failed"))
                }

            })
        }
    }, [image])

    const handleChange = useCallback((file: File | null) => {
        setImage(file)
    }, [])

    return (
        <div className="relative flex flex-col items-center rounded-lg shadow bg-white p-3 m-2 w-full sm:w-1/3">
            <h3 className="font-bold text-xl text-gray-600 self-start">Edition logo</h3>
            <ImagePicker
                className="avatar-uploader-large mt-5 flex-grow"
                defaultImage={mediaPath(data?.logoUrl, AvatarSizes.DEFAULT)}
                onChange={handleChange}
                onReset={() => setImage(null)}
            />
            {image && (
                <div className="w-full text-right">
                    <Button
                        className="text-white rounded border-green-500 bg-green-500"
                        onClick={updateChange}
                    >
                        {t("save")} <FontAwesomeIcon icon={faSave} className="ml-1"/>
                    </Button>
                </div>
            )}
        </div>
    )
}
export default ClubLogoForm
