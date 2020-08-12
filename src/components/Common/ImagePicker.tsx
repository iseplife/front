import React, {forwardRef, useCallback, useImperativeHandle, useMemo, useState} from "react"
import {Upload} from "antd"
import "./ImagePicker.css"
import {EditOutlined, PlusOutlined, LoadingOutlined, DeleteOutlined} from "@ant-design/icons"

const DEFAULT_IMAGE = "img/static/default-cover.png"

export type ImagePickerRef = { reset: () => void }
type ImagePickerProps = {
    className?: string
    defaultImage?: string
    onChange: (file: File | null) => void
}
const ImagePicker = forwardRef<ImagePickerRef, ImagePickerProps>(({className, defaultImage, onChange}, ref) => {
    const initialImage = useMemo(() => "https://iseplife.s3.eu-west-3.amazonaws.com/" + defaultImage, [defaultImage])
    const [image, setImage] = useState<string>(initialImage)
    const [loading, setLoading] = useState<boolean>()

    useImperativeHandle(ref, () => ({
        reset() {
            setImage(initialImage)
        }
    }))

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
                            <EditOutlined
                                className="mx-1 px-1 hover:text-white"
                                onClick={() => console.log("aaa")}
                            />
                            {image === initialImage && defaultImage !== DEFAULT_IMAGE &&
                            <DeleteOutlined
                                className="mx-1 px-1 hover:text-red-400"
                                onClickCapture={() => {
                                    setImage("https://iseplife.s3.eu-west-3.amazonaws.com/" + DEFAULT_IMAGE)
                                    onChange(null)
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
})
ImagePicker.displayName = "ImagePicker"
ImagePicker.defaultProps = {
    className: "",
    defaultImage: DEFAULT_IMAGE
}

export default ImagePicker