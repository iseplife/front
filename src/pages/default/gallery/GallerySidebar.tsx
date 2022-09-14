import React, {useCallback, useEffect, useState} from "react"
import {AvatarSizes, GallerySizes} from "../../../constants/MediaSizes"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCommentAlt, faHeart} from "@fortawesome/free-regular-svg-icons"
import {faCloudDownload, faHeart as faSolidHeart} from "@fortawesome/free-solid-svg-icons"
import {Divider, message} from "antd"
import CommentList from "../../../components/Comment/CommentList"
import StudentAvatar from "../../../components/Student/StudentAvatar"
import {getThread, toggleThreadLike} from "../../../data/thread"
import {SidebarProps} from "../../../components/Common/Lightbox"
import {Gallery} from "../../../data/gallery/types"
import {GalleryPhoto} from "./index"
import { downloadFile, formatDateWithTimer, mediaPath } from "../../../util"
import { useTranslation } from "react-i18next"
import Loading from "../../../components/Common/Loading"
import { isWebPSupported, polyfillWebp } from "../../../components/Common/WebPPolyfill"

type GallerySidebarProps = {
    gallery: Gallery
} & SidebarProps<GalleryPhoto>
const GallerySidebar: React.FC<GallerySidebarProps> = ({gallery, currentImage}) => {
    const [liked, setLiked] = useState<boolean>(false)
    const [nbLikes, setNbLikes] = useState<number>(0)
    const [nbComments, setNbComments] = useState<number>(0)

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
            canva.width = image.width
            canva.height = image.height
            const context = canva.getContext("2d")!
            context.drawImage(image, 0, 0)
            downloadLink = canva.toDataURL("image/jpeg")
        } else 
            downloadLink = await polyfillWebp(link, true)
        
        downloadFile(downloadLink, `${gallery.name}-${currentImage.id}.jpg`)
    }, [gallery.name, currentImage.src])

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
                            <div className="text-md">{ formattedDate }</div>
                        </div>
                    </div>
                    <button onClick={downloadProgress == -1 ? downloadCallback : undefined} className="flex relative overflow-hidden bg-indigo-400 hover:opacity-90 hover:shadow transition-all rounded text-white font-medium px-3.5 items-center">
                        <div className="bg-indigo-500 top-0 left-0 absolute h-full" style={{width: `${downloadProgress == -1 ? 0 : downloadProgress*100}%`}}></div>
                        <div className="z-10 hidden md:flex items-center">
                            {downloadProgress == -1 ? t("gallery:download") : t("gallery:downloading")}
                            {
                                downloadProgress == -1 ?
                                    <FontAwesomeIcon icon={faCloudDownload} className="ml-2" />
                                    :
                                    <Loading className="ml-2" />
                            }
                        </div>
                    </button>
                </div>
                <button
                    onClick={downloadProgress == -1 ? downloadCallback : undefined}
                    className="md:hidden absolute navbar m-3.5 w-9 h-9 top-0 right-0 flex overflow-hidden bg-indigo-400 hover:opacity-90 hover:shadow transition-all rounded-full text-white font-medium px-2 items-center"
                >
                    <div className="bg-indigo-500 top-0 left-0 absolute h-full" style={{width: `${downloadProgress == -1 ? 0 : downloadProgress*100}%`}}></div>
                    <div className="
                        grid place-items-center ml-[1.5px] rounded-full
                        cursor-pointer z-50 text-white transition-all duration-300 false
                    ">
                        {
                            downloadProgress == -1 ?
                                <FontAwesomeIcon icon={faCloudDownload} />
                                :
                                <Loading className="ml-0.5" />
                        }
                    </div>
                </button>
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
                                    className={`${liked ? "text-red-400" : "hover:text-red-600"} transition-colors`}
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
