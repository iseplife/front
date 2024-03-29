import React, {useCallback, useState} from "react"
import {AxiosResponse} from "axios"
import {message, Progress} from "antd"
import PictureCard from "../../Common/PictureCard"
import {useTranslation} from "react-i18next"
import {isFileImage} from "../../../util"
import {createMedia} from "../../../data/media"
import {Media, MediaUploadNSFW, MediaUploadStatus,} from "../../../data/media/types"
import {UploadState} from "../../../data/request.type"
import {faInbox, faTrashAlt} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { EmbedEnumType } from "../../../data/post/types"

const debugUploader = false

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
    const [imgUploadZoneId, setImgUploadZoneId] = useState<string>("imgupload" + Math.random().toString(36))

    const clearAllFiles = useCallback(() => {
        setImages(new Map())
    }, [])

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        if(uploadingState !== UploadState.OFF) return

        addImages(Array.from(e.dataTransfer.files))

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
    }, [inDropZone, uploadingState])

    const handleClick = useCallback(() => {
        document.getElementById(imgUploadZoneId)?.click()
    }, [imgUploadZoneId])

    const handleManualSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if(uploadingState !== UploadState.OFF) return
        addImages(Array.from(e.target.files || []))
    }, [uploadingState])

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

    const addImages = (images : File[]) => {
        setImages(prevState => {
            const map = new Map(prevState)
            const addMap = new Map()

            for (const file of images.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))) {
                addMap.set(file, {id: (Math.random() + 1).toString(36).substring(2), file, nsfw: false, state: MediaUploadStatus.UNPROCESSED})
            }
            
            addMap.forEach((value, key) => map.set(key, value))

            return map
        })
    }

    const uploadImages = useCallback(async () => {

        onUploading()

        setUploadingState(UploadState.UPLOADING)

        if(uploadingState != UploadState.ERROR){
            setImages(prevState => {
                prevState.forEach(value => value.state = MediaUploadStatus.WAITING)
                return prevState
            })
            setUploadCount(0)
        }
        
        let count = uploadCount
        const responses = uploadResp

        for (const img of images.values()) {

            try {
                if (isFileImage(img.file.type)) {

                    if(img.state == MediaUploadStatus.UPLOADED) continue

                    setImages(prevState => prevState.set(img.file, {...img, state: MediaUploadStatus.UPLOADING}))

                    if(debugUploader)
                        await new Promise(f => setTimeout(f, 500))

                    const res = await createMedia(
                        img,
                        EmbedEnumType.IMAGE,
                        club,
                        true,
                        e => setProgression((count + e.loaded / e.total) / images.size * 100)
                    )
                    responses.push(res)

                    if(debugUploader)
                        if(Math.random() > 0.7) throw new Error("Une erreur de test !")

                    count++
                    setUploadCount(count)

                    setImages(prevState => prevState.set(img.file, {...img, state: MediaUploadStatus.UPLOADED}))
                }
            } catch (e: any) {
                setImages(prevState => prevState.set(img.file, {...img, state: MediaUploadStatus.FAILED}))
                setUploadingState(UploadState.ERROR)
                message.error(e.message)

                setProgression(count / images.size * 100)
                setUploadResp(responses)

                break
            }
        }

        if(count == images.size){
            afterSubmit(responses.map(r => r.data.id))
            setUploadingState(UploadState.FINISHED)
        }
        
    }, [afterSubmit, images, uploadCount, uploadResp, club, onUploading, uploadingState])

    return (
        <div
            className="h-full w-full p-8 flex flex-col justify-between"
            onDrop={handleDrop}
            onDragOver={handleOver}
            onDragLeave={handleLeave}
        >
            <div className="h-full flex flex-col py-4">
                <input id={imgUploadZoneId} type="file" multiple value="" className="hidden" onChange={handleManualSelect} disabled={uploadingState !== UploadState.OFF}/>
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
                    {uploadingState == UploadState.OFF && <span>{images.size} Photos</span>}
                    {uploadingState != UploadState.OFF && <span>{uploadCount}/{images.size} Photos</span>}                  
                </div>
            </div>
           
            {uploadingState !== UploadState.OFF &&
            <Progress percent={progression} status={uploadingState} showInfo={false}/>}
            <div className="flex justify-between">
                <button
                    disabled={images.size == 0 || uploadingState !== UploadState.OFF}
                    className="text-center py-2 disabled:text-opacity-60 text-red-600 font-medium text-base duration-200" onClick={clearAllFiles}
                >
                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2"/> Vider les images
                </button>
                <button
                    type="button"
                    disabled={!canSubmit || images.size === 0 || (uploadingState !== UploadState.OFF && uploadingState != UploadState.ERROR)}
                    className="bg-indigo-400 rounded-full text-center px-8 py-2 disabled:bg-opacity-60 text-white font-medium text-base duration-200"
                    onClick={uploadImages}
                >
                    {uploadingState == UploadState.ERROR ? "Reprendre" :  "Enregistrer"}
                </button>
            </div>
        </div>
    )
}

export default GalleryDragger
