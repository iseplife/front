import React, {ImgHTMLAttributes, useMemo, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEyeSlash} from "@fortawesome/free-regular-svg-icons"
import {MediaStatus} from "../../data/media/types"
import MediaProcessing from "./MediaProcessing"


type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
    nsfw: boolean,
    status: MediaStatus
    hide?: boolean,
    clickable?: boolean
}

const SafeImage: React.FC<SafeImageProps> = (props) => {
    const {nsfw, status, hide, clickable, className, ...imgProps} = props
    const safeMode = useMemo(() => Boolean(localStorage.getItem("nsfw") || true), [])
    const [hidden, setHidden] = useState<boolean>(nsfw && safeMode)
    const ready = useMemo(() => status === MediaStatus.READY, [status])

    return ready ? (
        <div className={`
            ${className} 
            ${clickable && "image-display"} 
            ${!ready && "h-56 flex-grow mx-2"}
            relative bg-gray-300 overflow-hidden m-auto w-max rounded`
        }>
            <div className="overflow-hidden h-full w-full">
                <img
                    {...imgProps}
                    style={hidden ? {
                        ...props.style,
                        WebkitFilter: "blur(12px)",
                        filter: "blur(12px)",
                        msFilter: "blur(12px)"
                    } : {...props.style}}
                    alt={""}
                />
            </div>
            {hidden && !hide && (
                <div className="cursor-pointer" style={{left: "50%", top: "50%", position: "absolute", transform: "translate(-50%, -50%)"}}>
                    <span className="flex flex-col justify-center items-center text-indigo-400" onClick={() => setHidden(false)}>
                        <FontAwesomeIcon icon={faEyeSlash} size="lg"/> NSFW
                    </span>
                </div>
            )}
        </div>
    ): <MediaProcessing />
}

SafeImage.defaultProps = {
    nsfw: false,
    className: "",
    clickable: true
}

export default SafeImage
