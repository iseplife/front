import React, {useCallback, useContext, useMemo, useState} from "react"
import ImagePicker from "../Common/ImagePicker"
import {Avatar, Button, message} from "antd"
import {uploadClubLogo} from "../../data/club"
import {useTranslation} from "react-i18next"
import {ClubContext} from "../../context/club/context"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {faCircleNotch, faSave} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"


const ClubLogo: React.FC = () => {
    const {state: {club: {data: club, loading}, adminMode}} = useContext(ClubContext)
    const {t} = useTranslation()
    const imagePath = useMemo(() =>
        club?.logoUrl ?
            mediaPath(club.logoUrl, AvatarSizes.DEFAULT):
            undefined
    , [club])
    const [logo, setLogo] = useState<File | null>()
    const [logoChanged, setLogoChanged] = useState(false)

    const updateLogo = useCallback(() => {
        if (club?.id && logo !== undefined) {
            uploadClubLogo(club.id, logo).then(res => {
                if (res.status === 200) {
                    message.success("logo updated !")
                } else {
                    message.error("logo upload failed")
                }

            })
        }
    }, [club])

    const handleChange = useCallback((file: File | null) => {
        setLogoChanged(true)
        setLogo(file)
    }, [])


    return adminMode ?
        <div>
            <ImagePicker
                className="avatar-uploader -mt-8 w-auto"
                defaultImage={imagePath}
                onChange={handleChange}
                onReset={() => setLogoChanged(false)}/>
            {logoChanged &&
            <Button
                type="primary"
                className="rounded mt-2"
                onClick={updateLogo}
            >
                {t("save")} <FontAwesomeIcon icon={faSave} className="ml-1"/>
            </Button>
            }
        </div> :
        <Avatar src={imagePath} shape="circle" className="-mt-8 w-20 h-20 md:w-32 md:h-32 shadow-md bg-white">
            {loading && <FontAwesomeIcon icon={faCircleNotch} spin size="2x" className="text-white mt-6"/>}
        </Avatar>

}
export default ClubLogo
