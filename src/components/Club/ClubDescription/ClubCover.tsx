import React, {useCallback, useContext, useState} from "react"
import {Button,} from "antd"
import {IconFA} from "../../Common/IconFA"
import {useTranslation} from "react-i18next"
import ImagePicker from "../../Common/ImagePicker"
import {uploadCover} from "../../../data/club"
import {ClubContext} from "../../../context/club/context"

const ClubCover: React.FC = () => {
    const {t} = useTranslation()
    const { state: {club: { data: club}, adminMode} } = useContext(ClubContext)
    const [coverChanged, setCoverChanged] = useState(false)
    const [image, setImage] = useState<File | null>(null)

    const updateCover = useCallback(() => {
        if (club?.id && coverChanged)
            uploadCover(club.id, image).then()
    }, [club, image, coverChanged])


    const handleChange = useCallback((file: File | null) => {
        setCoverChanged(true)
        setImage(file)
    }, [])

    return (
        <div className="w-full md:h-40 h-24">
            {adminMode ?
                <div className="relative w-full h-full">
                    <ImagePicker defaultImage={club?.coverUrl} className="cover-uploader h-full" onChange={handleChange} onReset={() => setCoverChanged(false)}/>
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
                        backgroundImage: `url("${"https://iseplife.s3.eu-west-3.amazonaws.com/" + (club?.coverUrl || "/img/default-cover.png")}")`,
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