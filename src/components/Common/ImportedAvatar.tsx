import React, {useEffect, useState} from "react"
import {Avatar} from "antd"
import {faUser} from "@fortawesome/free-regular-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

const ImportedAvatar: React.FC<{ file: Blob | undefined, large?:boolean }> = ({file, large}) => {
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
        <Avatar icon={<FontAwesomeIcon icon={faUser}/>} src={preview} size={ large ? "large" : "small"} />
    )
}

export default ImportedAvatar
