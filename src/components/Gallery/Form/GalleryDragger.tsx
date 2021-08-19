import React, {useCallback, useState} from "react"
import {AxiosResponse} from "axios"
import {Button, message, Progress} from "antd"
import PictureCard from "../../Common/PictureCard"
import {useTranslation} from "react-i18next"
import {isFileImage} from "../../../util"
import {createMedia} from "../../../data/media"
import {Media, MediaUploadNSFW} from "../../../data/media/types"
import {UploadState} from "../../../data/request.type"
import {faInbox} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const UPLOADER_ID = "imgupload"

type GalleryDraggerProps = {
    club?: number
    canSubmit: boolean
    afterSubmit: (ids: number[]) => void
}

const GalleryDragger: React.FC<GalleryDraggerProps> = ({afterSubmit, canSubmit, club}) => {
    const {t} = useTranslation("gallery")
    const [uploadingState, setUploadingState] = useState<UploadState>(UploadState.OFF)
    const [images, setImages] = useState<MediaUploadNSFW[]>([])
    const [progression, setProgression] = useState<number>(0)
    const [inDropZone, setInDropZone] = useState<boolean>(false)

    const clearAllFiles = useCallback(() => {
        setImages([])
    }, [])

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        // @ts-ignore
        setImages(prevState => [...prevState, ...[...e.target.files].map(f => ({file: f, nsfw: false}))])
        setInDropZone(false)
    }, [])

    const handleLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (inDropZone) setInDropZone(false)
    }, [inDropZone])

    const handleOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (!inDropZone) setInDropZone(true)
    }, [inDropZone])

    const handleClick = useCallback(() => {
        document.getElementById(UPLOADER_ID)?.click()
    }, [])

    const handleManualSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // @ts-ignore
        setImages(prevState => [...prevState, ...[...e.target.files].map(f => ({file: f, nsfw: false}))])
    }, [])

    const deleteImage = useCallback((index: number) => {
        setImages(prevState => prevState.filter((_, i) => i !== index))
    }, [])

    const toggleNSFW = (id: number) => {
        setImages(images => (
            images.map((img, i) => id === i ?
                {...img, nsfw: !img.nsfw} :
                img
            )
        ))

    }

    const uploadImages = useCallback(async () => {
        const responses: AxiosResponse<Media>[] = []
        setUploadingState(UploadState.UPLOADING)

        let res: AxiosResponse<Media>
        for (const img of images) {
            try {
                if (isFileImage(img.file.type)) {
                    res = await createMedia(
                        img,
                        club,
                        true,
                        e => setProgression(p => p + Math.round((e.loaded * 100) / (e.total * images.length)))
                    )
                    responses.push(res)
                }
            } catch (e) {
                setUploadingState(UploadState.ERROR)
                message.error(e.message)
                break
            }
        }

        afterSubmit(responses.map(r => r.data.id))
        setUploadingState(UploadState.FINISHED)
    }, [afterSubmit, images, club])


    return (
        <div
            className="h-full w-full flex flex-col p-3 overflow-y-auto"
            onDrop={handleDrop}
            onDragOver={handleOver}
            onDragLeave={handleLeave}
        >
            <input id={UPLOADER_ID} type="file" multiple className="hidden" onChange={handleManualSelect}/>
            <h1 className="text-gray-500 font-bold text-lg mb-6">Photos</h1>
            <div
                onClick={handleClick}
                className={`flex flex-wrap cursor-pointer m-2 text-center rounded flex-grow border-dashed border-2 ${inDropZone ? "border-gray-600" : "border-gray-400"}`}
            >
                {images.length ?
                    images.map((img, i) => (
                        <PictureCard key={i} index={i} file={img.file} onDelete={deleteImage} nsfw={img.nsfw} toggleNsfw={toggleNSFW}/>
                    )) :
                    <div className="flex flex-col justify-center h-full w-full items-center text-center text-gray-500">
                        <p className="font-bold text-xl m-0">{t("form.draganddrop.0")}</p>
                        <p className="text-5xl">
                            <FontAwesomeIcon icon={faInbox} />
                        </p>
                        <p className="text-xs" style={{width: "30rem"}}>
                            {t("form.draganddrop.1")}
                        </p>
                    </div>
                }
            </div>
            {uploadingState !== UploadState.OFF && <Progress percent={progression} status={uploadingState} showInfo={false}/>}
            <div className="text-right">
                <Button disabled={images.length == 0} type="primary" className="border-red-500 bg-red-400 rounded m-3 self-end" onClick={clearAllFiles}>
                    Supprimer images
                </Button>
                <Button disabled={!canSubmit} type="primary" className="border-green-500 bg-green-400 rounded m-3 self-end" onClick={uploadImages}>
                    Enregistrer
                </Button>
            </div>
        </div>
    )
}

export default GalleryDragger
