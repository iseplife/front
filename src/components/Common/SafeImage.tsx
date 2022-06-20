import React, {ImgHTMLAttributes, useCallback, useEffect, useMemo, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEyeSlash} from "@fortawesome/free-regular-svg-icons"
import {MediaStatus} from "../../data/media/types"
import LoadingSpinner from "./LoadingSpinner"


type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
    nsfw: boolean
    status: MediaStatus
    onLoaded?: () => void
    lowQualitySrc?: string | undefined
    src: string | undefined
    width: number
    height: number
    skipNsfw?: boolean
}

const SafeImage: React.FC<SafeImageProps> = (props) => {
    const {nsfw, status, onLoaded, skipNsfw, src, width, height, lowQualitySrc} = props
    const safeMode = useMemo(() => Boolean(localStorage.getItem("nsfw") || true), [])
    const [hidden, setHidden] = useState<boolean>(nsfw && safeMode && !skipNsfw)
    const ready = useMemo(() => status === MediaStatus.READY, [status])
    const unhideCallback = useCallback(() => setHidden(false), [])
    useEffect(() => {
        if(!ready){
            let id: number
            const check = () => {
                const img = new Image()
                img.onload = onLoaded!
                img.onerror = () => id = window.setTimeout(check, 1000)
                img.src = lowQualitySrc!
            }

            id = window.setTimeout(check, 800)

            return () => clearTimeout(id)
        }
    }, [ready, onLoaded])

    return <>
        <img width={width} height={height} className="w-full h-full invisible" />
        {!ready && 
            <div className="w-full h-full grid place-items-center absolute top-0 scale-50 drop-shadow-xl">
                <LoadingSpinner />
            </div>
        }
        {ready && lowQualitySrc && <img src={lowQualitySrc} alt="Image" className="w-full h-full absolute top-0 object-cover" style={hidden ? {
            WebkitFilter: "blur(12px)",
            filter: "blur(12px)",
            msFilter: "blur(12px)"
        } : {}} />}
        {ready && <img src={src} alt="Image" className="w-full h-full absolute top-0 object-cover" style={hidden ? {
            WebkitFilter: "blur(12px)",
            filter: "blur(12px)",
            msFilter: "blur(12px)"
        } : {}} />}
        {hidden && ready && (
            <div className="cursor-pointer grid place-items-center w-full h-full absolute top-0 left-0 text-indigo-300 text-xl bg-neutral-800/50" onClick={unhideCallback}>
                <span><FontAwesomeIcon icon={faEyeSlash} size="lg"/> NSFW</span>
            </div>
        )}
    </>
}

SafeImage.defaultProps = {
    nsfw: false,
}

export default SafeImage
