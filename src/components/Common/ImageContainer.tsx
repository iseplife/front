import React, {ImgHTMLAttributes, useEffect} from "react"
import {MediaStatus} from "../../data/media/types"
import MediaProcessing from "./MediaProcessing"
import MediaProcessingFailed from "./MediaProcessingFailed"
import SafeImage, {SafeImageProps} from "./SafeImage"

const PERIODIC_CHECK_MS = 5000

export type ImageContainerProps = {
    status: MediaStatus
    onProcessingFinished?: () => void
} & ImgHTMLAttributes<HTMLImageElement> & SafeImageProps

const ImageContainer: React.FC<ImageContainerProps> = (props) => {
    const {status, onProcessingFinished, ...imgProps} = props

    useEffect(() => {
        if(status != MediaStatus.READY) {
            const check = setInterval(() => {
                const image = new Image()
                image.src = imgProps.src as string
                image.onload = () => {
                    if(onProcessingFinished)
                        onProcessingFinished()
                }
            }, PERIODIC_CHECK_MS)

            return () => clearInterval(check)
        }
    }, [status, imgProps])

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

export default ImageContainer
