import React, { useCallback, useMemo, useState} from "react"
import {Upload} from "antd"
import "./ImagePicker.css"
import {EditOutlined, PlusOutlined, LoadingOutlined, DeleteOutlined, UndoOutlined} from "@ant-design/icons"

const DEFAULT_IMAGE = "img/static/default-cover.png"

type ImagePickerProps = {
    className?: string
    defaultImage?: string
    onReset?: () => void
    onChange: (file: File | null) => void
}
const ImagePicker: React.FC<ImagePickerProps> = ({className, defaultImage, onChange, onReset}) => {
    const initialImage = useMemo(() => "https://iseplife.s3.eu-west-3.amazonaws.com/" + defaultImage, [defaultImage])
    const [image, setImage] = useState<string>(initialImage)
    const [loading, setLoading] = useState<boolean>()


    const handleImage = useCallback((file: File) => {
        setLoading(true)
        const reader = new FileReader()
        reader.onload = e => {
            setImage(reader.result as string)
            setLoading(false)
        }
        reader.readAsDataURL(file)

        onChange(file)
        return false
    }, [onChange])

    return (
        <>
            <Upload
                name="avatar"
                listType="picture-card"
                className={`flex justify-center ${className}`}
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
                            {image === initialImage && defaultImage !== DEFAULT_IMAGE ?
                                <DeleteOutlined
                                    className="mx-1 px-1 hover:text-red-400"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setImage("https://iseplife.s3.eu-west-3.amazonaws.com/" + DEFAULT_IMAGE)
                                        onChange(null)
                                    }}
                                /> :
                                <UndoOutlined
                                    className="mx-1 px-1 hover:text-red-400"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setImage(initialImage)
                                        onReset && onReset()
                                    }}
                                />
                            }
                        </span>
                    </div>
                    :
                    <div>
                        {loading ? <LoadingOutlined/> : <PlusOutlined/>}
                        <div className="ant-upload-text">Upload</div>
                    </div>
                }
            </Upload>
        </>
    )
}
ImagePicker.defaultProps = {
    className: "",
    defaultImage: DEFAULT_IMAGE
}

export default ImagePicker