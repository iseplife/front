import React, {useCallback, useEffect, useState} from "react"
import {AvatarSizes, GallerySizes} from "../../../constants/MediaSizes"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCommentAlt, faHeart} from "@fortawesome/free-regular-svg-icons"
import {faCloudDownload, faShare, faShareAlt, faHeart as faSolidHeart} from "@fortawesome/free-solid-svg-icons"
import {Divider, message} from "antd"
import CommentList from "../../../components/Comment/CommentList"
import StudentAvatar from "../../../components/Student/StudentAvatar"
import {getThread, toggleThreadLike} from "../../../data/thread"
import {SidebarProps} from "../../../components/Common/Lightbox"
import {Gallery} from "../../../data/gallery/types"
import {GalleryPhoto} from "./index"
import { copyToClipboard, downloadFile, formatDateWithTimer, getImageLink, limitSize, mediaPath, releaseCanvas, shareImage as sImage } from "../../../util"
import { useTranslation } from "react-i18next"
import Loading from "../../../components/Common/Loading"
import { isWebPSupported, polyfillWebp } from "../../../components/Common/WebPPolyfill"
import { isWebKit } from "../../../data/app"
import { cFaShare } from "../../../constants/CustomFontAwesome"

type GallerySidebarProps = {
    gallery: Gallery
} & SidebarProps<GalleryPhoto>
const GallerySidebar: React.FC<GallerySidebarProps> = ({gallery, currentIndex, currentImage}) => {
    const [liked, setLiked] = useState<boolean>(false)
    const [nbLikes, setNbLikes] = useState<number>(0)
    const [nbComments, setNbComments] = useState<number>(0)
    const [isDownloadingImage, setIsDownloadingImage] = useState<boolean>(false)
    const [isSharingImage, setIsSharingImage] = useState<boolean>(false)


    const {t} = useTranslation(["common", "gallery"])

    const [formattedDate, setFormattedDate] = useState("")
    useEffect(() => formatDateWithTimer(gallery.creation, t, setFormattedDate), [gallery.creation])

    const toggleLike = useCallback(async () => {
        const res = await toggleThreadLike(currentImage.thread)
        if (res.status === 200) {
            setLiked(res.data)
            setNbLikes(prevLikes => res.data ? prevLikes + 1 : prevLikes - 1)
        }
    }, [currentImage.thread])

    useEffect(() => {
        getThread(currentImage.thread).then(res => {
            setLiked(res.data.liked)
            setNbComments(res.data.nbComments)
            setNbLikes(res.data.nbLikes)
        })
    }, [currentImage.thread])

    const [downloadProgress, setDownloadProgress] = useState(-1)
    const [,setStopProgress] = useState<()=>void>()

    useEffect(() => {
        setStopProgress(stopProgress => {
            stopProgress?.()
            setDownloadProgress(-1)
            return undefined
        })
    }, [currentImage.id])

    const downloadCallback = useCallback(async () => {
        const link = mediaPath(currentImage.srcSet as string, GallerySizes.DOWNLOAD)

        const req = new XMLHttpRequest()
        req.open("GET", link, true)
        req.responseType = "blob"

        req.onprogress = evt => {
            if (evt.lengthComputable){
                const percentComplete = (evt.loaded / evt.total)
                setDownloadProgress(percentComplete * (isWebPSupported ? 1 : 0.8))
            }
        }
        req.send()
        
        setStopProgress(() => () => req.onprogress = undefined!)
        
        setDownloadProgress(0)
        try{
            await new Promise<void>((resolve, reject) => {
                req.onreadystatechange = () =>
                    req.readyState == 4 && resolve()
                req.onerror = reject
            })
        }catch(e){
            message.error(t("gallery:failed_download"))
        }finally{
            req.onprogress = undefined!
        }

        let downloadLink: string
        
        if (isWebPSupported) {
            const originalResponseLink = URL.createObjectURL(req.response)
            const image = new Image()
            image.src = originalResponseLink
            await new Promise(resolve => image.onload = resolve)
            setDownloadProgress(-1)
            URL.revokeObjectURL(originalResponseLink)
            
            const canva = document.createElement("canvas")

            let size = {width: image.width, height: image.height}

            if(isWebKit){
                console.log("Limiting size of canva because of Safari")
                size = limitSize(size)
                console.log("Limited to", size)
            }

            canva.width = size.width
            canva.height = size.height
            const context = canva.getContext("2d")!
            context.drawImage(image, 0, 0, canva.width, canva.height)
            downloadLink = canva.toDataURL("image/jpeg")

            releaseCanvas(canva)
        } else 
            downloadLink = await polyfillWebp(link, true)
        
        return downloadLink

    }, [currentImage.srcSet, t])

    const downloadImage = useCallback(async () => {
        setIsDownloadingImage(true)
        const downloadLink = await downloadCallback()
        downloadFile(downloadLink, `${gallery.name}-${currentImage.id}.jpg`, t("gallery:saved"))
        setIsDownloadingImage(false)

    }, [currentImage.id, downloadCallback, gallery.name, t])

    const shareImage = useCallback(async () => {
        setIsSharingImage(true)
        const downloadLink = await downloadCallback()
        sImage(downloadLink, `${gallery.name}-${currentImage.id}.jpg`)
        setIsSharingImage(false)
    }, [currentImage.id, downloadCallback, gallery.name])

    return (
        <div>
            <div className="flex flex-col p-4">
                <div className="hidden md:flex w-full justify-between mb-1">
                    <div className="flex">
                        <StudentAvatar
                            id={gallery.club.id}
                            name={gallery.club.name}
                            picture={gallery.club.logoUrl}
                            pictureSize={AvatarSizes.THUMBNAIL}
                            showPreview
                            size="large"
                        />
                        <div className="items-center ml-3">
                            <div className="font-bold -mb-0.5 text-base">{gallery.club.name}</div>
                            <div className="text-md whitespace-nowrap">{ formattedDate }</div>
                        </div>
                    </div>
                    <div className="flex space-x-2">

                        <button onClick={downloadProgress == -1 ? shareImage : undefined} className="rounded-full flex relative overflow-hidden bg-indigo-400 hover:opacity-90 hover:shadow transition-all text-white font-medium px-3.5 items-center aspect-square">
                            <div className="bg-indigo-500 top-0 left-0 absolute h-full" style={{width: `${downloadProgress == -1 || isDownloadingImage ? 0 : downloadProgress*100}%`}}></div>
                            <div className="z-10 hidden md:flex items-center">
                                {
                                    downloadProgress == -1 || isDownloadingImage ?
                                        <FontAwesomeIcon icon={cFaShare}/>
                                        :
                                        <Loading />
                                }
                            </div>
                        </button>
                        
                        <button onClick={downloadProgress == -1 ? downloadImage : undefined} className="flex relative overflow-hidden bg-indigo-400 hover:opacity-90 hover:shadow transition-all rounded text-white font-medium px-3.5 items-center">
                            <div className="bg-indigo-500 top-0 left-0 absolute h-full" style={{width: `${downloadProgress == -1 || isSharingImage ? 0 : downloadProgress*100}%`}}></div>
                            <div className="z-10 hidden md:flex items-center">
                                {downloadProgress == -1 || isSharingImage ? t("gallery:download") : t("gallery:downloading")}
                                {
                                    downloadProgress == -1 || isSharingImage ?
                                        <FontAwesomeIcon icon={faCloudDownload} className="ml-2" />
                                        :
                                        <Loading className="ml-2" />
                                }
                            </div>
                        </button>
                    </div>
                   
                </div>
                <div className="md:hidden absolute navbar m-3.5 top-0 right-0 flex space-x-4">
                    <button
                        onClick={downloadProgress == -1 ? shareImage : undefined}
                        className="w-9 h-9 flex overflow-hidden bg-indigo-400 hover:opacity-90 hover:shadow transition-all rounded-full text-white font-medium px-2 items-center justify-center relative"
                    >
                        <div className="bg-indigo-500 top-0 left-0 absolute h-full" style={{width: `${downloadProgress == -1 || isDownloadingImage ? 0 : downloadProgress*100}%`}}></div>
                        <div className="
                            grid place-items-center rounded-full
                            cursor-pointer z-50 text-white transition-all duration-300 false
                        ">
                            {
                                downloadProgress == -1 || isDownloadingImage ?
                                    <FontAwesomeIcon icon={cFaShare} />
                                    :
                                    <Loading className="ml-0.5" />
                            }
                        </div>
                    </button>
                    <button
                        onClick={downloadProgress == -1 ? downloadImage : undefined}
                        className="w-9 h-9 flex overflow-hidden bg-indigo-400 hover:opacity-90 hover:shadow transition-all rounded-full text-white font-medium px-2 items-center justify-center relative"
                    >
                        <div className="bg-indigo-500 top-0 left-0 absolute h-full" style={{width: `${downloadProgress == -1 || isSharingImage ? 0 : downloadProgress*100}%`}}></div>
                        <div className="
                            grid place-items-center rounded-full
                            cursor-pointer z-50 text-white transition-all duration-300 false
                        ">
                            {
                                downloadProgress == -1 || isSharingImage ?
                                    <FontAwesomeIcon icon={faCloudDownload} />
                                    :
                                    <Loading className="ml-0.5" />
                            }
                        </div>
                    </button>
                </div>
                
                <div className="text-base ml-2 mt-2 hidden md:block">
                    {gallery.name}
                </div>
                <div className="flex flex-row text-gray-600 justify-between mt-1 -mb-2.5">
                    <div className="items-center text-gray-400 grid grid-cols-2 w-full mr-5 text-center">
                        <span className="group flex items-center justify-center cursor-pointer hover:text-indigo-500 mr-3 text-xl transition-colors duration-100">
                            <div className="text-base mx-1.5 w-7 text-right">
                                {nbComments > 0 && nbComments}
                            </div>
                            <div className="-ml-1 cursor-pointer rounded-full bg-indigo-700 bg-opacity-0 group-hover:bg-opacity-10 transition-colors duration-200 w-10 h-10 items-center flex justify-center">
                                <FontAwesomeIcon
                                    icon={faCommentAlt}
                                    size="1x"
                                />
                            </div>
                        </span>
                        <span
                            className="group flex items-center justify-center cursor-pointer mr-3 text-xl"
                            onClick={toggleLike}
                        >
                            <div className="text-base mx-1.5 w-7 text-right">
                                {nbLikes > 0 && nbLikes}
                            </div>
                            <div className="-ml-1 cursor-pointer rounded-full bg-red-700 bg-opacity-0 group-hover:bg-opacity-10 transition-colors duration-200 w-10 h-10 items-center flex justify-center">
                                <FontAwesomeIcon
                                    icon={liked ? faSolidHeart: faHeart}
                                    className={`${liked ? "text-red-400" : "group-hover:text-red-600"} transition-colors`}
                                    size="1x"
                                />
                            </div>
                        </span>
                    </div>
                </div>
                <Divider className="mb-0 mt-4" />
                <CommentList
                    id={currentImage.thread}
                    numberComments={nbComments}
                    depth={0}
                    loadComment={nbComments !== 0}
                    lightboxView={true}
                />
            </div>
        </div>
    )
}

export default GallerySidebar
