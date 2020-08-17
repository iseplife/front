import React, {useCallback, useContext, useState} from "react"
import ImagePicker from "../Common/ImagePicker"
import {Avatar, Button, message} from "antd"
import {IconFA} from "../Common/IconFA"
import {uploadClubLogo} from "../../data/club"
import {useTranslation} from "react-i18next"
import {ClubContext} from "../../context/club/context"


const ClubLogo: React.FC = () => {
    const {state: {club: {data: club, loading}, adminMode}} = useContext(ClubContext)
    const {t} = useTranslation()

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
            <ImagePicker className="avatar-uploader -mt-8 w-auto" defaultImage={club?.logoUrl} onChange={handleChange} onReset={() => setLogoChanged(false)}/>
            {logoChanged &&
            <Button
                type="primary"
                className="rounded mt-2"
                onClick={updateLogo}
            >
                {t("save")} <IconFA className="ml-1" name="fa-save"/>
            </Button>
            }
        </div> :
        <Avatar src={club?.logoUrl} shape="circle" className="-mt-8 w-20 h-20 md:w-32 md:h-32 shadow-md">
            {loading && <IconFA name="fa-circle-notch" spin size="2x" type="solid" className="text-white mt-6"/>}
        </Avatar>

}
export default ClubLogo