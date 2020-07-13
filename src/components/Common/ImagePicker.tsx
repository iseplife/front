import React, {useState} from "react"
import {Upload} from "antd"
import "./ImagePicker.css"
import {EditOutlined, PlusOutlined, LoadingOutlined} from "@ant-design/icons"

type ImagePickerProps = {
    className?: string
    defaultImage?: string
    onChange: (file: File | null) => void
}

const ImagePicker: React.FC<ImagePickerProps> = ({className = "", defaultImage, onChange}) => {
    const [image, setImage] = useState<string | undefined>(
        defaultImage ? "https://iseplife.s3.eu-west-3.amazonaws.com/" + defaultImage : undefined
    )
    const [loading, setLoading] = useState<boolean>()

    const handleImage = (file: File) => {
        setLoading(true)
        const reader = new FileReader()
        reader.onload = e => {
            setImage(reader.result as string)
            setLoading(false)
        }
        reader.readAsDataURL(file)

        onChange(file)
        return false
    }

    return (
        <>
            <Upload
                name="avatar"
                listType="picture-card"
                className={`${className} avatar-uploader flex justify-center mt-5`}
                showUploadList={false}
                beforeUpload={handleImage}
            >
                {image ?
                    <div className="image-display relative w-full h-full">
                        <div
                            className="w-full h-full"
                            style={{
                                backgroundImage: `url("${image}")`,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                        <span className="image-options absolute text-gray-400">
                            <EditOutlined className="mx-1 px-1 hover:text-white"/>
                        </span>
                    </div>
                    :
                    <div>
                        {loading ? <LoadingOutlined/> : <PlusOutlined/>}
                        <div className="ant-upload-text">Upload</div>
                    </div>
                }
            </Upload>
            {image &&
            <span className="text-center cursor-pointer hover:text-red-700" onClick={() => {
            	setImage(undefined)
            	onChange(null)
            }}>
                   Supprimer
            </span>
            }
        </>
    )
}

export default ImagePicker