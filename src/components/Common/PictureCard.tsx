import React, {useCallback, useEffect, useState} from "react"
import ImageOverlay from "./ImageOverlay"
import {Badge} from "antd"
import {faEyeSlash, faLowVision, faCircleNotch, faCheck, faTimes} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrashAlt, faClock} from "@fortawesome/free-regular-svg-icons"
import { releaseCanvas } from "../../util"
import { MediaUploadStatus } from "../../data/media/types"

type PictureCardProps<MediaType> = {
    file: MediaType
    onDelete: (media: MediaType) => void
    className?: string
    nsfw?: boolean
    toggleNsfw: (media: MediaType) => void
    id?: string
    statusUpload?: MediaUploadStatus
}

let current: Promise<string> | undefined = undefined

const optiImage = async (url: string) => {
    if (current)
        await current
    return await (current = (async () => {
        const canva = document.createElement("canvas")
        try{
            const context = canva.getContext("2d")
            const img = new Image()
            img.src = url
            await new Promise(resolve => img.onload = resolve)
            canva.width = 150
            canva.height = 150 / img.width * img.height
            context?.drawImage(img, 0, 0, canva.width, canva.height)
            return canva.toDataURL()
        } finally {
            releaseCanvas(canva)
        }
    })())
}

const PictureCard = <MediaType extends (File | string)>({file, onDelete,id, nsfw, toggleNsfw, className, statusUpload}: PictureCardProps<MediaType>) => {
    const [image, setImage] = useState<string>()

    useEffect(() => {
        if (file instanceof File) {
            const reader = new FileReader()
            reader.onload = async () => {
                const url = URL.createObjectURL(new Blob([reader.result as ArrayBuffer]))
                setImage(await optiImage(url))
                URL.revokeObjectURL(url)
            }
            reader.readAsArrayBuffer(file)
        } else {
            setImage(file as string)
        }
    }, [file])

    const handleDelete = useCallback((e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        onDelete(file)
    }, [onDelete, file])

    const handleNSFW = useCallback((e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        toggleNsfw(file)
    }, [toggleNsfw, file])

    return (
        <Badge count={nsfw ?
            <FontAwesomeIcon icon={faEyeSlash} className="bg-white p-0.5 rounded-full text-red-600 top-2 right-2"/>:
            0
        }>
            <div className={`h-20 w-20 m-2 ${className}`}>
                {image && (
                    <ImageOverlay src={image} className="h-full w-full rounded-xl overflow-hidden">

                        { (!statusUpload || statusUpload == MediaUploadStatus.UNPROCESSED) && (
                            <><FontAwesomeIcon
                                icon={faLowVision} size="lg" className="mx-1 text-white hover:text-blue-200 cursor-pointer"
                                onClick={handleNSFW}
                            />
                            <FontAwesomeIcon
                                icon={faTrashAlt} size="lg" className="mx-1 text-white hover:text-red-400 cursor-pointer"
                                onClick={handleDelete}
                            /></>
                        )}
                        { (statusUpload && statusUpload == MediaUploadStatus.WAITING) && (
                            <><FontAwesomeIcon
                                icon={faClock} size="lg" className="mx-1 text-white cursor-pointer"
                            /></>
                        )}
                        { (statusUpload && statusUpload == MediaUploadStatus.UPLOADING) && (
                            <><FontAwesomeIcon
                                icon={faCircleNotch} spin size="lg" className="mx-1 text-white cursor-pointer"
                            /></>
                        )}
                        { (statusUpload && statusUpload == MediaUploadStatus.UPLOADED) && (
                            <><FontAwesomeIcon
                                icon={faCheck}  size="lg" className="mx-1 text-white cursor-pointer"
                            /></>
                        )}
                        { (statusUpload && statusUpload == MediaUploadStatus.FAILED) && (
                            <><FontAwesomeIcon
                                icon={faTimes} size="lg" className="mx-1 text-white cursor-pointer"
                            /></>
                        )}
                    </ImageOverlay>
                )}
            </div>
        </Badge>
    )
}

PictureCard.displayName = "PictureCard"


export default React.memo(
    PictureCard
) as typeof PictureCard
