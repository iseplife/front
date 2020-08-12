import React, {useCallback, useRef, useState} from "react"
import {Button,} from "antd"
import {IconFA} from "../../Common/IconFA"
import {useTranslation} from "react-i18next"
import ImagePicker, {ImagePickerRef} from "../../Common/ImagePicker"
import {uploadCover} from "../../../data/club"

type ClubCoverProps = {
    id?: number
    cover?: string
    canEdit: boolean
}
const ClubCover: React.FC<ClubCoverProps> = ({id, cover, canEdit}) => {
    const {t} = useTranslation()
    const pickerRef = useRef<ImagePickerRef>(null)
    const [coverChanged, setCoverChanged] = useState(false)
    const [image, setImage] = useState<File | null>(null)

    const updateCover = useCallback(() => {
        if (id && coverChanged)
            uploadCover(id, image).then()
    }, [id, image, coverChanged])

    const resetCover = useCallback(() => {
        if (pickerRef.current)
            pickerRef.current.reset()
        setCoverChanged(false)
    }, [pickerRef])

    const handleChange = useCallback((file: File | null) => {
        setCoverChanged(true)
        setImage(file)
    }, [])

    return (
        <div className="w-full md:h-40 h-24">
            {canEdit ?
                <div className="relative w-full h-full">
                    <ImagePicker ref={pickerRef} defaultImage={cover} className="cover-uploader h-full" onChange={handleChange}/>
                    {coverChanged &&
                    <div
                        className="absolute"
                        style={{
                            bottom: 5,
                            right: 5
                        }}
                    >
                        <Button
                            type="primary"
                            className="mx-1 rounded"
                            onClick={resetCover}
                        >
                            {t("reset")} <IconFA className="ml-1" name="fa-undo"/>
                        </Button>
                        <Button
                            type="primary"
                            className="mx-1 rounded"
                            onClick={updateCover}
                        >
                            {t("save")} <IconFA className="ml-1" name="fa-save"/>
                        </Button>
                    </div>
                    }
                </div> :
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `url("${"https://iseplife.s3.eu-west-3.amazonaws.com/" + cover || "/img/default-cover.png"}")`,
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