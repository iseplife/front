import React from "react"
import VideoPlayer from "./VideoPlayer"
import {Video as VideoType} from "../../../data/media/types"

type VideoProps = {
    data: VideoType
}

const Video: React.FC<VideoProps> = ({data}) => {
    return (
        <div>
            <div className="flex justify-between items-baseline">
                <h3 className="text-gray-700">
                    {data.title}
                </h3>
            </div>
            <div className="flex flex-col items-center mx-5">
                <VideoPlayer src={data.name} thumbnail={data.thumbnail}/>
            </div>
        </div>
    )
}

export default Video