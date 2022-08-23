import React, {useEffect, useRef} from "react"
import {mediaPath} from "../../../util"

type VideoPlayerProps = {
    src: string
    thumbnail: string
    autoPlay: boolean
}
const VideoPlayer: React.FC<VideoPlayerProps> = ({src, thumbnail, autoPlay}) => {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        const fnc = () => {
            for(const video of document.querySelectorAll("video"))
                if(video != videoRef.current)
                    video.pause()
        }
        console.log(videoRef.current)
        videoRef.current?.addEventListener("play", fnc)
        return () => videoRef.current?.removeEventListener("play", fnc)
    }, [videoRef.current])

    return (
        <div>
            <video
                poster={thumbnail}
                ref={videoRef}
                controls
                preload="auto"
                className="w-full h-full"
                crossOrigin=""
                autoPlay={autoPlay}
            >
                <source src={mediaPath(src)} type="video/mp4" />
            </video>
        </div>
    )
}

export default VideoPlayer