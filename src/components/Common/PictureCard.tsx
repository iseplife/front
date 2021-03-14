import React, {useCallback, useEffect, useState} from "react"
import ImageOverlay from "./ImageOverlay"
import {IconFA} from "./IconFA"

type PictureCardProps = {
    index: number
    file: File
    onDelete: (id: number) => void
    className?: string
    toggleNsfw: (id: number) => void
}
const PictureCard: React.FC<PictureCardProps> = React.memo(({index, file, onDelete, className, toggleNsfw}) => {
    const [image, setImage] = useState<string>()

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

    const handleNSFW = useCallback((e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        toggleNsfw(index)
    }, [toggleNsfw, index])


    return (
        <div className={`h-20 w-20 m-2 ${className}`}>
            {image && (
                <ImageOverlay src={image} className="h-full w-full rounded">
                    <IconFA name="fa-low-vision" size="lg" type="solid" className="mx-1 text-white hover:text-yellow-400" onClick={handleNSFW}/>
                    <IconFA name="fa-trash-alt" size="lg" type="regular" className="mx-1 text-white hover:text-red-400" onClick={handleDelete}/>
                </ImageOverlay>
            )}
        </div>
    )
})
PictureCard.displayName = "PictureCard"
PictureCard.defaultProps = {
    className: ""
}

export default PictureCard
