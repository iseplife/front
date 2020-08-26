import React, {useCallback, useEffect, useState} from "react"
import {DeleteOutlined} from "@ant-design/icons"

type PictureCardProps = {
    index: number
    file: File
    onDelete: (id: number) => void
}
const PictureCard: React.FC<PictureCardProps> = React.memo(({index, file, onDelete}) => {
    const [image, setImage] = useState()

    useEffect(() => {
        const reader = new FileReader()
        reader.onload = e => {
            setImage(reader.result as string)
        }
        reader.readAsDataURL(file)
    }, [file])

    const handleDelete = useCallback((e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        onDelete(index)
    }, [onDelete, index])

    return (
        <div className="image-display relative h-20 w-20 bg-gray-400 m-3">
            {image &&
            <>
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
                    <DeleteOutlined className="mx-1 px-1 hover:text-red-400" onClick={handleDelete}/>
                </span>
            </>
            }
        </div>
    )
})
PictureCard.displayName = "PictureCard"

export default PictureCard