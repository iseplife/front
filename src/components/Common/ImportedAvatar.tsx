import React, {useEffect, useState} from "react"
import {Avatar} from "antd"
import {UserOutlined} from "@ant-design/icons"

const ImportedAvatar: React.FC<{ file: Blob | undefined }> = ({file}) => {
    const [preview, setPreview] = useState<string>()
    useEffect(() => {
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }, [file])

    return (
        <Avatar icon={<UserOutlined/>} src={preview} size="small"/>
    )
}

export default ImportedAvatar