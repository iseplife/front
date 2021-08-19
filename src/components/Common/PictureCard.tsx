import React, {useCallback, useEffect, useState} from "react"
import ImageOverlay from "./ImageOverlay"
import {Badge} from "antd"
import {faEyeSlash, faLowVision} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faTrashAlt} from "@fortawesome/free-regular-svg-icons"

type PictureCardProps = {
    index: number
    file: File | string
    onDelete: (id: number) => void
    className?: string
    nsfw?: boolean
    toggleNsfw: (id: number) => void
}
const PictureCard: React.FC<PictureCardProps> = React.memo(({index, file, onDelete, className, toggleNsfw, nsfw = false}) => {
    const [image, setImage] = useState<string>()

    useEffect(() => {
        if(file instanceof File) {
            const reader = new FileReader()
            reader.onload = e => {
                setImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }else{
            setImage(file)
        }
    }, [file])

    const handleDelete = useCallback((e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        onDelete(index)
    }, [onDelete, index])

    const handleNSFW = useCallback((e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        toggleNsfw(index)
    }, [toggleNsfw, index])


    return (
        <Badge count={nsfw ? <FontAwesomeIcon icon={faEyeSlash} className="bg-white p-0.5 rounded-full text-red-600 top-2 right-2"/> : 0}>
            <div className={`h-20 w-20 m-2 ${className}`}>
                {image && (
                    <ImageOverlay src={image} className="h-full w-full rounded">
                        <FontAwesomeIcon icon={faLowVision} size="lg" className="mx-1 text-white hover:text-yellow-400" onClick={handleNSFW}/>
                        <FontAwesomeIcon icon={faTrashAlt} size="lg" className="mx-1 text-white hover:text-red-400" onClick={handleDelete}/>
                    </ImageOverlay>
                )}
            </div>
        </Badge>
    )
})
PictureCard.displayName = "PictureCard"
PictureCard.defaultProps = {
    className: ""
}

export default PictureCard
