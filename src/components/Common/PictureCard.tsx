import React, {useCallback, useEffect, useState} from "react"
import {DeleteOutlined} from "@ant-design/icons"
import ImageOverlay from "./ImageOverlay";

type PictureCardProps = {
    index: number
    file: File
    onDelete: (id: number) => void
    className?: string
}
const PictureCard: React.FC<PictureCardProps> = React.memo(({index, file, onDelete, className}) => {
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
        <div className={`h-20 w-20 m-2 ${className}`}>
            {image &&
            <ImageOverlay src={image} className="h-full w-full rounded">
                <DeleteOutlined className="mx-1 px-1 hover:text-red-400" onClick={handleDelete}/>
            </ImageOverlay>
            }
        </div>
    )
})
PictureCard.displayName = "PictureCard"
PictureCard.defaultProps = {
    className: ""
}

export default PictureCard