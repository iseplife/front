import React, {useCallback, useEffect, useMemo} from "react"
import VideoPlayer from "./VideoPlayer"
import {MediaStatus, Video as VideoType} from "../../../data/media/types"
import { EmbedEnumType, Post } from "../../../data/post/types"
import { feedsManager } from "../../../datamanager/FeedsManager"
import { mediaPath } from "../../../util"
import LoadingSpinner from "../../Common/LoadingSpinner"

type VideoProps = {
    data: VideoType
    post: Post
    onLoaded?: () => void
}

const Video: React.FC<VideoProps> = ({data, post}) => {
    const ready = useMemo(() => data.status === MediaStatus.READY, [data.status])

    const onLoaded = useCallback(() => {
        const embed = post.embed as VideoType & {embedType: EmbedEnumType.VIDEO}
        embed.status = MediaStatus.READY
        feedsManager.updatePost(post.id, { embed })
    }, [])

    useEffect(() => {
        if(!ready){
            let id: number
            const check = () => {
                const video = new Audio(mediaPath(data.name))
                video.oncanplaythrough = onLoaded!
                video.onerror = () => id = window.setTimeout(check, 800)
            }

            id = window.setTimeout(check, 800)

            return () => clearTimeout(id)
        }
    }, [ready, onLoaded, data.name])

    return (
        <div>
            <div className="flex justify-between items-baseline">
                <h3 className="text-gray-700">
                    {data.title}
                </h3>
            </div>
            <div className="flex flex-col items-center mx-3 rounded-xl overflow-hidden">
                <div className="rounded-xl overflow-hidden relative border-[#dbe2e6] border cursor-pointer" style={{
                    ...(data.ratio > 1 ? {
                        width: "100%",
                    } : {
                        maxHeight: "400px",
                    }),
                    aspectRatio: data.ratio.toString(),
                }}>
                    { ready ?
                        <VideoPlayer src={data.name} thumbnail={data.thumbnail}/>
                        :
                        <div className="w-full h-full grid place-items-center bg-neutral-300 relative">
                            <LoadingSpinner className="drop-shadow-xl h-full scale-50" />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Video