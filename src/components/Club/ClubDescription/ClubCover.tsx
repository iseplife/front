import React, {useCallback, useState} from "react"
import {Button, message,} from "antd"
import {IconFA} from "../../Common/IconFA"
import {useTranslation} from "react-i18next"
import {EditOutlined, LoadingOutlined, PlusOutlined} from "@ant-design/icons"
import {RcFile, UploadChangeParam} from "antd/es/upload"
import ImagePicker from "../../Common/ImagePicker"
import {uploadCover} from "../../../data/club";

const getBase64 = (img: any, callback: any): void => {
    const reader = new FileReader()
    reader.addEventListener("load", () => callback(reader.result))
    reader.readAsDataURL(img)
}

type ClubCoverProps = {
    id?: number
    cover?: string
    canEdit: boolean
}
const ClubCover: React.FC<ClubCoverProps> = ({id, cover, canEdit}) => {
    const {t} = useTranslation()
    const [coverChanged, setCoverChanged] = useState(false)
    const [image, setImage] = useState<File | null>(null)

    const updateCover = useCallback(() => {
        if(id)
            uploadCover(id, image).then()
    }, [id, image])
    const handleChange = useCallback((file: File | null) => {
        setCoverChanged(true)
        setImage(file)
    }, [])
    return (
        <div className="flex flex-row content-center w-full md:h-40 h-24">
            {canEdit ?
                <div className="relative w-full h-full">
                    <ImagePicker className="cover-uploader h-full" onChange={handleChange}/>
                    {coverChanged &&
                    <Button
                        type="primary"
                        className="absolute rounded"
                        onClick={updateCover}
                        style={{
                            bottom: 5,
                            right: 5
                        }}
                    >
                        {t("save")} <IconFA className="ml-1" name="fa-save" />
                    </Button>
                    }
                </div> :
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `url("${cover || "/img/default-cover.png"}")`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            }
        </div>
    )
}

export default ClubCover