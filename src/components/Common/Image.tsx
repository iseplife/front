import React, {ImgHTMLAttributes, useEffect} from "react"
import {MediaStatus} from "../../data/media/types"
import MediaProcessing from "./MediaProcessing"
import MediaProcessingFailed from "./MediaProcessingFailed"
import SafeImage, {SafeImageProps} from "./SafeImage"


type ImageProps = ImgHTMLAttributes<HTMLImageElement> & SafeImageProps & {
    status: MediaStatus
}

const Image: React.FC<ImageProps> = (props) => {
    const {status, ...imgProps} = props

    useEffect(() => {

    })

    switch (status){
        case MediaStatus.READY:
            return <SafeImage {...imgProps}/>
        case MediaStatus.UNPROCESSED:
        case MediaStatus.PROCESSING:
            return <MediaProcessing />
        case MediaStatus.ERROR:
            return <MediaProcessingFailed />
    }
}

export default Image
