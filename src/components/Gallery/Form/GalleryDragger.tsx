import React, {useCallback, useState} from "react"
import {AxiosResponse} from "axios"
import {Button, message, Progress} from "antd"
import PictureCard from "../../Common/PictureCard"
import {useTranslation} from "react-i18next"
import {isFileImage} from "../../../util"
import {createMedia} from "../../../data/media"
import {Media, MediaUploadNSFW, MediaUploadStatus,} from "../../../data/media/types"
import {UploadState} from "../../../data/request.type"
import {faInbox, faTrash, faTrashAlt, faTrashCan} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { EmbedEnumType } from "../../../data/post/types"

const UPLOADER_ID = "imgupload"

type GalleryDraggerProps = {
    club?: number
    canSubmit: boolean
    afterSubmit: (ids: number[]) => void
    onUploading: () => void
}

const GalleryDragger: React.FC<GalleryDraggerProps> = ({afterSubmit, onUploading, canSubmit, club}) => {
    const {t} = useTranslation("gallery")
    const [uploadingState, setUploadingState] = useState<UploadState>(UploadState.OFF)
    const [images, setImages] = useState<Map<File, MediaUploadNSFW>>(new Map())
    const [progression, setProgression] = useState<number>(0)
    const [uploadCount, setUploadCount] = useState<number>(0)
    const [uploadResp, setUploadResp] = useState<AxiosResponse<Media, any>[]>([])
    const [inDropZone, setInDropZone] = useState<boolean>(false)
    const [isSorted, setSorted] = useState<boolean>(false)

    const clearAllFiles = useCallback(() => {
        setImages(new Map())
    }, [])

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if(uploadingState !== UploadState.OFF) return

        setSorted(false)

        setImages(prevState => {
            const newMap = new Map(prevState)
            for (const file of e.dataTransfer.files) {
                newMap.set(file, {id: (Math.random() + 1).toString(36).substring(2), file, nsfw: false, state: MediaUploadStatus.UNPROCESSED})
            }
            return newMap
        })
        setInDropZone(false)
    }, [uploadingState])

    const handleLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (inDropZone) setInDropZone(false)
    }, [inDropZone])

    const handleOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (!inDropZone && uploadingState !== UploadState.OFF) setInDropZone(true)
    }, [inDropZone])

    const handleClick = useCallback(() => {
        document.getElementById(UPLOADER_ID)?.click()
    }, [])

    const handleManualSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if(uploadingState !== UploadState.OFF) return
        setImages(prevState => {
            setSorted(false)
            const newMap = new Map(prevState)
            const files = e.target.files || []

            for (const file of files) {
                newMap.set(file, {id: (Math.random() + 1).toString(36).substring(2), file, nsfw: false, state: MediaUploadStatus.UNPROCESSED})
            }
            return newMap
        })
    }, [])

    const deleteImage = useCallback((media: File) => {
        setImages(prevState => {
            const newMap = new Map(prevState)
            newMap.delete(media)

            return newMap
        })
    }, [])

    const toggleNSFW = useCallback((media: File) => {
        setImages(prevState => {
            const newMap = new Map(prevState)
            if (newMap.has(media)) {
                const target = newMap.get(media) as MediaUploadNSFW
                newMap.set(media, {...target, nsfw: !target.nsfw})
            }

            return newMap
        })
    }, [])

    const sortImages = useCallback(async () => {
        setImages(prevState => {
            const newMap = new Map([...prevState.entries()].sort((a, b) => a[0].name.localeCompare(b[0].name)))
            return newMap
        })
        setSorted(true)
    }, [isSorted])

    const uploadImages = useCallback(async () => {

        onUploading()

        setUploadingState(UploadState.UPLOADING)

        setImages(prevState => {
            const newMap = new Map(prevState)
            for (const file of images.keys()) {
                const target = newMap.get(file) as MediaUploadNSFW
                if(target.state != MediaUploadStatus.UPLOADED)
                    newMap.set(file, {...target, state: MediaUploadStatus.WAITING})
            }
            return newMap
        })

        let i = uploadCount
        const responses = uploadResp

        for (const img of images.values()) {

            try {
                if (isFileImage(img.file.type)) {

                    if(img.state == MediaUploadStatus.UPLOADED) continue

                    setImages(prevState => prevState.set(img.file, {...img, state: MediaUploadStatus.UPLOADING}))

                    // await new Promise(f => setTimeout(f, 500))

                    const res = await createMedia(
                        img,
                        EmbedEnumType.IMAGE,
                        club,
                        true,
                        e => setProgression((i + e.loaded / e.total) / images.size * 100)
                    )
                    responses.push(res)

                    // if(Math.random() > 0.5) throw new Error("Une erreur de test !")

                    i++
                    setProgression(i / images.size * 100)

                    setImages(prevState => prevState.set(img.file, {...img, state: MediaUploadStatus.UPLOADED}))
                }
            } catch (e: any) {
                setImages(prevState => prevState.set(img.file, {...img, state: MediaUploadStatus.FAILED}))
                setUploadingState(UploadState.ERROR)
                message.error(e.message)

                setUploadCount(i)
                setUploadResp(responses)

                break
            }
        }

        if(i == images.size){
            afterSubmit(responses.map(r => r.data.id))
            setUploadingState(UploadState.FINISHED)
        }
        
    }, [afterSubmit, images, uploadCount, uploadResp, club])


    return (
        <div
            className="h-full w-full p-8 flex flex-col justify-between"
            onDrop={handleDrop}
            onDragOver={handleOver}
            onDragLeave={handleLeave}
        >
            <div className="h-full flex flex-col py-4">
                <input id={UPLOADER_ID} type="file" multiple value="" className="hidden" onChange={handleManualSelect} disabled={uploadingState !== UploadState.OFF}/>
                <div
                    onClick={handleClick}
                    className={`h-80 overflow-y-auto flex flex-wrap cursor-pointer m-2 text-center rounded flex-grow border-dashed border-2 hover:border-indigo-400 border-transparent transition duration-100 ${inDropZone ? "border-blue-600" : "border-gray-400"}`}
                >
                    {images.size > 0 ?
                        [...images.values()].map((img) => (
                            <PictureCard
                                key={img.id}
                                file={img.file}
                                nsfw={img.nsfw}
                                onDelete={deleteImage}
                                toggleNsfw={toggleNSFW}
                                statusUpload={img.state}
                            />
                        )) :
                        <div className="flex flex-col justify-center h-full w-full items-center text-center text-gray-500">
                            <p className="font-bold text-xl m-0">{t("form.draganddrop.0")}</p>
                            <p className="text-5xl">
                                <FontAwesomeIcon icon={faInbox}/>
                            </p>
                            <p className="text-xs" style={{width: "30rem"}}>
                                {t("form.draganddrop.1")}
                            </p>
                        </div>
                    }
                </div>
                <div className="px-2 font-semibold text-base">
                    {images.size} Photos
                </div>
            </div>
           
            {uploadingState !== UploadState.OFF &&
            <Progress percent={progression} status={uploadingState} showInfo={false}/>}
            <div className="flex justify-between">
                <button
                    disabled={images.size == 0 || uploadingState !== UploadState.OFF}
                    className="text-center px-8 py-2 disabled:text-opacity-60 text-red-600 font-medium text-base duration-200" onClick={clearAllFiles}
                >
                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2"/> Vider les images
                </button>
                { isSorted && <button
                    type="button"
                    disabled={!canSubmit || images.size === 0 || (uploadingState !== UploadState.OFF && uploadingState != UploadState.ERROR)}
                    className="bg-indigo-400 rounded-full text-center px-8 py-2 disabled:bg-opacity-60 text-white font-medium text-base duration-200"
                    onClick={uploadImages}
                >
                    Enregistrer
                </button>
                || <button
                    type="button"
                    disabled={!canSubmit || images.size === 0 || uploadingState !== UploadState.OFF}
                    className="bg-indigo-400 rounded-full text-center px-8 py-2 disabled:bg-opacity-60 text-white font-medium text-base duration-200"
                    onClick={sortImages}
                >
                    Réorganiser
                </button>}
            </div>
        </div>
    )
}

export default GalleryDragger
