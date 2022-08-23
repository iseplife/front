import React, {useCallback, useEffect, useMemo, useState} from "react"
import VideoPlayer from "./VideoPlayer"
import {MediaStatus, Video as VideoType} from "../../../data/media/types"
import { EmbedEnumType, Post } from "../../../data/post/types"
import { feedsManager } from "../../../datamanager/FeedsManager"
import { mediaPath } from "../../../util"
import LoadingSpinner from "../../Common/LoadingSpinner"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons"

type VideoProps = {
    data: VideoType
    postId: number
    postEmbed: VideoType & {embedType: EmbedEnumType.VIDEO}
    onLoaded?: () => void
}

const Video: React.FC<VideoProps> = ({data, postId, postEmbed}) => {
    const ready = useMemo(() => data.status === MediaStatus.READY, [data.status])

    const onLoaded = useCallback(() => {
        postEmbed.status = MediaStatus.READY
        feedsManager.updatePost(postId, { embed: postEmbed })
    }, [postId, postEmbed])

    const thumb = useMemo(() => mediaPath(data.name.replace("vid/", "vid/thumb/")), [])

    useEffect(() => {
        if(!ready){
            let id: number
            const check = () => {
                if (id == -1)
                    return
                const video = new Audio()
                video.crossOrigin = "anonymous"
                video.src = mediaPath(data.name)
                video.oncanplaythrough = () => {
                    const img = new Image()
                    img.crossOrigin = "anonymous"
                    img.onload = onLoaded
                    img.src = thumb
                    img.onerror = () => id != -1 && window.setTimeout(check, 3000)
                }
                video.onerror = () => id != -1 && window.setTimeout(check, 3000)

            }

            setTimeout(() =>
                check()
            , 4000)

            return () => { id = -1 }
        }
    }, [ready, onLoaded, data.name])

    const [clicked, setClicked] = useState(false)
    const onClick = useCallback(() => setClicked(true), [])

    return (
        <div>
            <div className="flex justify-between items-baseline">
                <h3 className="text-gray-700">
                    {data.title}
                </h3>
            </div>
            <div className="mx-1 md:mx-3 rounded-xl overflow-hidden relative border-[#dbe2e6] border cursor-pointer max-h-[400px] z-[1]" style={{
                height: data.ratio <= 1 ? "400px" : "",
                aspectRatio: data.ratio.toString(),
            }}>
                { ready ?
                    <div className="w-full h-full relative">
                        <div onClick={onClick} className={`w-full h-full bg-cover absolute z-10 transition-opacity duration-500 ${clicked ? "opacity-0 pointer-events-none" : "opacity-100"}`} style={{backgroundImage: `url(${thumb})`}}>
                            <div className="absolute w-full h-full bg-neutral-800/50 text-6xl items-center justify-center text-white flex">
                                <FontAwesomeIcon icon={faPlayCircle} />
                            </div>
                        </div>
                        {clicked && <VideoPlayer src={data.name} thumbnail={thumb} autoPlay />}
                    </div>
                    :
                    <div className="w-full h-full grid place-items-center bg-neutral-300 relative">
                        <LoadingSpinner className="drop-shadow-xl h-full scale-50" />
                    </div>
                }
            </div>
        </div>
    )
}

export default Video