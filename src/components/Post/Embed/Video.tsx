import React, {useCallback, useEffect, useMemo} from "react"
import VideoPlayer from "./VideoPlayer"
import {MediaStatus, Video as VideoType} from "../../../data/media/types"
import { EmbedEnumType, Post } from "../../../data/post/types"
import { feedsManager } from "../../../datamanager/FeedsManager"
import { mediaPath } from "../../../util"
import LoadingSpinner from "../../Common/LoadingSpinner"

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

    useEffect(() => {
        if(!ready){
            let id: number
            const check = () => {
                if (id == -1)
                    return
                const video = new Audio(mediaPath(data.name))
                video.oncanplaythrough = onLoaded!
                video.onerror = () => id != -1 && window.setTimeout(check, 1000)
            }

            return () => { id = -1 }
        }
    }, [ready, onLoaded, data.name])

    return (
        <div>
            <div className="flex justify-between items-baseline">
                <h3 className="text-gray-700">
                    {data.title}
                </h3>
            </div>
            <div className="mx-3 rounded-xl overflow-hidden relative border-[#dbe2e6] border cursor-pointer max-h-[400px]" style={{
                height: data.ratio <= 1 ? "400px" : "",
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
    )
}

export default Video