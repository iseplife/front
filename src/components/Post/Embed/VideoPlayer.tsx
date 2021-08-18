import React, {useRef} from "react"
import {mediaPath} from "../../../util"

type VideoPlayerProps = {
    src: string
    thumbnail: string
}
const VideoPlayer: React.FC<VideoPlayerProps> = ({src, thumbnail}) => {
    const videoRef = useRef(null)

    return (
        <div>
            <video
                poster={mediaPath(thumbnail)}
                ref={videoRef}
                controls
                preload="auto"
            >
                <source src={mediaPath(src)} type="video/mp4" />
            </video>
        </div>
    )
}

export default VideoPlayer