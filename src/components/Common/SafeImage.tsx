import React, {ImgHTMLAttributes, useCallback, useMemo, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEyeSlash} from "@fortawesome/free-regular-svg-icons"
import {MediaStatus} from "../../data/media/types"


type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
    nsfw: boolean
    status: MediaStatus
    lowQualitySrc?: string | undefined
    src: string | undefined
    width: number
    height: number
    skipNsfw?: boolean
}

const SafeImage: React.FC<SafeImageProps> = (props) => {
    const {nsfw, status, skipNsfw, src, width, height, lowQualitySrc} = props
    const safeMode = useMemo(() => Boolean(localStorage.getItem("nsfw") || true), [])
    const [hidden, setHidden] = useState<boolean>(nsfw && safeMode && !skipNsfw)
    const ready = useMemo(() => status === MediaStatus.READY, [status])
    const unhideCallback = useCallback(() => setHidden(false), [])

    return <>
        <img width={width} height={height} className="w-full h-full invisible" />
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
        {hidden && (
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
