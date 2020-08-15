import React, {useCallback, useRef, useState} from "react"
import ImagePicker from "../Common/ImagePicker"
import {Avatar, Button, message} from "antd"
import {IconFA} from "../Common/IconFA"
import {uploadClubLogo} from "../../data/club"
import {useTranslation} from "react-i18next"

type ClubLogoProps = {
    id?: number
    src?: string
    loading: boolean
    canEdit: boolean
}
const ClubLogo: React.FC<ClubLogoProps> = ({id, src, loading, canEdit}) => {
    const {t} = useTranslation()
    const [logo, setLogo] = useState<File | null>()
    const [logoChanged, setLogoChanged] = useState(false)

    const updateLogo = useCallback(() => {
        if (id && logo !== undefined) {
            uploadClubLogo(id, logo).then(res => {
                if (res.status === 200) {
                    message.success("logo updated !")
                } else {
                    message.error("logo upload failed")
                }

            })
        }
    }, [id])

    const handleChange = useCallback((file: File | null) => {
        setLogoChanged(true)
        setLogo(file)
    }, [])


    return canEdit ?
        <div>
            <ImagePicker className="avatar-uploader -mt-8 w-auto" defaultImage={src} onChange={handleChange} onReset={() => setLogoChanged(false)}/>
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
        <Avatar src={src} shape="circle" className="-mt-8 w-20 h-20 md:w-32 md:h-32 shadow-md">
            {loading && <IconFA name="fa-circle-notch" spin size="2x" type="solid" className="text-white mt-6"/>}
        </Avatar>

}
export default ClubLogo