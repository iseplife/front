import React, {useMemo} from "react"
import VideoPlayer from "./VideoPlayer"
import {MediaStatus, Video as VideoType} from "../../../data/media/types"
import MediaProcessing from "../../Common/MediaProcessing"
import MediaProcessingFailed from "../../Common/MediaProcessingFailed"

type VideoProps = {
    data: VideoType
}

const Video: React.FC<VideoProps> = ({data}) => {
    const videoComponent = useMemo<JSX.Element>(() => {
        switch (data.status){
            case MediaStatus.READY:
                return <VideoPlayer src={data.name} thumbnail={data.thumbnail}/>
            case MediaStatus.UNPROCESSED:
            case MediaStatus.PROCESSING:
                return (
                    <div className="w-full">
                        <MediaProcessing/>
                    </div>
                )
            case MediaStatus.ERROR:
                return <MediaProcessingFailed />
        }
    }, [data.status])


    return (
        <div>
            <div className="flex justify-between items-baseline">
                <h3 className="text-gray-700">
                    {data.title}
                </h3>
            </div>
            <div className="flex flex-col items-center mx-3">
                {videoComponent}
            </div>
        </div>
    )
}

export default Video