import React, {ImgHTMLAttributes, useCallback, useEffect, useMemo, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEyeSlash} from "@fortawesome/free-regular-svg-icons"
import {MediaStatus} from "../../data/media/types"
import LoadingSpinner from "./LoadingSpinner"
import WebPPolyfill from "./WebPPolyfill"


type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
    nsfw: boolean
    status: MediaStatus
    onLoaded?: () => void
    lowQualitySrc?: string
    src: string
    highQualitySrc?: string | false
    skipNsfw?: boolean
    ratio: number
}

const SafeImage: React.FC<SafeImageProps> = (props) => {
    const {nsfw, status, onLoaded, skipNsfw, src, lowQualitySrc, highQualitySrc} = props
    const safeMode = useMemo(() => Boolean(localStorage.getItem("nsfw") || true), [])
    const [hidden, setHidden] = useState<boolean>(nsfw && safeMode && !skipNsfw)
    const ready = useMemo(() => status === MediaStatus.READY, [status])
    const unhideCallback = useCallback(() => setHidden(false), [])
    useEffect(() => {
        if(!ready){
            let id: number
            const check = () => {
                if (id == -1) return
                fetch(lowQualitySrc ?? src).then(onLoaded).catch(() => id != -1 && window.setTimeout(check, 1000))
            }

            id = window.setTimeout(check, 800)

            return () => { id = -1 }
        }
    }, [ready, onLoaded])

    return <>
        <img width={props.width} height={props.height} className="w-full h-full invisible" />
        {!ready && 
            <div className="w-full h-full grid place-items-center absolute top-0 scale-50 drop-shadow-xl">
                <LoadingSpinner />
            </div>
        }
        {ready && <>
            {lowQualitySrc &&
                <WebPPolyfill src={lowQualitySrc} alt="Low quality Image" className="w-full h-full absolute top-0 object-cover" style={hidden ? {
                    WebkitFilter: "blur(12px)",
                    filter: "blur(12px)",
                    msFilter: "blur(12px)"
                } : {}} />
            }
            <WebPPolyfill src={src} alt="Image" className="w-full h-full absolute top-0 object-cover" style={hidden ? {
                WebkitFilter: "blur(12px)",
                filter: "blur(12px)",
                msFilter: "blur(12px)"
            } : {}} />
            {highQualitySrc &&
                <WebPPolyfill crossOrigin="" src={highQualitySrc} alt="High quality Image" className="w-full h-full absolute top-0 object-cover" style={hidden ? {
                    WebkitFilter: "blur(12px)",
                    filter: "blur(12px)",
                    msFilter: "blur(12px)"
                } : {}} />
            }
            {hidden && 
                <div className="cursor-pointer grid place-items-center w-full h-full absolute top-0 left-0 text-indigo-300 text-xl bg-neutral-800/50" onClick={unhideCallback}>
                    <span><FontAwesomeIcon icon={faEyeSlash} size="lg"/> NSFW</span>
                </div>
            }
        </>}
    </>
}

SafeImage.defaultProps = {
    nsfw: false,
}

export default SafeImage
