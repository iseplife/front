import React, {useMemo} from "react"
import VideoPlayer from "./VideoPlayer"
import {MediaStatus, Video as VideoType} from "../../../data/media/types"
import MediaProcessing from "../../Common/MediaProcessing"

type VideoProps = {
    data: VideoType
}

const Video: React.FC<VideoProps> = ({data}) => {
    const ready = useMemo(() => data.status === MediaStatus.READY, [data.status])

    return (
        <div>
            <div className="flex justify-between items-baseline">
                <h3 className="text-gray-700">
                    {data.title}
                </h3>
            </div>
            <div className="flex flex-col items-center mx-3">
                {ready ?
                    <VideoPlayer src={data.name} thumbnail={data.thumbnail}/> :
                    <div className="w-full">
                        <MediaProcessing/>
                    </div>
                }
            </div>
        </div>
    )
}

export default Video