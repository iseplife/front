import React, {useCallback, useEffect, useState} from "react"
import ImagePicker from "../Common/ImagePicker"
import {useTranslation} from "react-i18next"
import {Avatar, Button, message, Upload} from "antd"
import {UserOutlined} from "@ant-design/icons"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {IconFA} from "../Common/IconFA"
import {updateCustomPicture} from "../../data/student"
import {StudentPicture} from "../../data/student/types"
import {useDispatch} from "react-redux"
import {ContextReducerType} from "../../context/reducer"

type StudentImageUploaderProps = {
    original?: string
    custom?: string
    onUpdate?: (pictures: StudentPicture) => void
}

const StudentImageUploader: React.FC<StudentImageUploaderProps> = ({original, custom, onUpdate}) => {
    const {t} = useTranslation(["setting", "common"])
    const dispatch = useDispatch<ContextReducerType>()
    const [file, setFile] = useState<File | null>()
    const [fileStr, setFileStr] = useState<string>()

    const handleImage = useCallback((file: File) => {
        setFile(file)
        return false
    }, [])

    useEffect(() => {
        if(file) {
            const reader = new FileReader()
            reader.onload = e => setFileStr(reader.result as string)

            reader.readAsDataURL(file)
        }else {
            setFileStr(undefined)
        }
    }, [file])

    const handleSubmit = useCallback(() => {
        if(file !== undefined){
            updateCustomPicture(file).then(res => {
                message.success(t("picture_updated"))
                dispatch({ type: "SET_PICTURE", payload: res.data })
                setFile(undefined)
            }).catch(() => message.error((t("common:error"))))
        }else{
            message.error((t("common:error")))
        }
    }, [file])

    return (
        <div className="flex flex-col items-center justify-between p-8 border-dashed border-2 border-gray-400 rounded-lg h-64 relative">
            {fileStr || custom ?
                <>
                    <ImagePicker
                        defaultImage={mediaPath(custom, AvatarSizes.DEFAULT) || fileStr}
                        className="avatar-squared rounded"
                        onReset={() => setFile(undefined)}
                        onChange={setFile}

                    />
                    <div
                        className="absolute h-16 w-16 font-dinot text-center"
                        style={{bottom: 5, right: 5}}
                    >
                        {t("default")}
                        <Avatar
                            src={mediaPath(original, AvatarSizes.DEFAULT)}
                            icon={<UserOutlined/>}
                            className="rounded"
                        />
                    </div>

                    {file !== undefined && (
                        <Button className="bg-green-400 font-dinot text-green-700 hover:text-green-800 rounded-lg" onClick={handleSubmit}>
                            {t("common:save")} <IconFA className="ml-2" name="fa-save" type="regular" />
                        </Button>
                    )}
                </> :
                <>
                    <Avatar
                        src={mediaPath(original, AvatarSizes.DEFAULT)} icon={<UserOutlined/>}
                        className="rounded"
                        size={135}
                    />
                    <Upload beforeUpload={handleImage}>
                        <Button
                            style={{width: "max-content"}}
                            className="rounded-lg font-dinot border-2 border-gray-600 text-gray-600 hover:text-gray-600"
                        >
                            {t("add_picture")} <IconFA className="ml-2" name="fa-upload"/>
                        </Button>
                    </Upload>
                </>
            }
        </div>
    )
}

export default StudentImageUploader