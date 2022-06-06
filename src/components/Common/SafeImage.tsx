import React, {ImgHTMLAttributes, useMemo, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEyeSlash} from "@fortawesome/free-regular-svg-icons"


export type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & {
    nsfw: boolean,
    hide?: boolean,
    clickable?: boolean
}

const SafeImage: React.FC<SafeImageProps> = (props) => {
    const {nsfw, hide, clickable, className, ...imgProps} = props
    const safeMode = useMemo(() => Boolean(localStorage.getItem("nsfw") || true), [])
    const [hidden, setHidden] = useState<boolean>(nsfw && safeMode)

    return (
        <div className={`
            ${className} 
            ${clickable && "image-display"} 
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
                <div className="cursor-pointer" style={{
                    left: "50%",
                    top: "50%",
                    position: "absolute",
                    transform: "translate(-50%, -50%)"
                }}>
                    <span
                        className="flex flex-col justify-center items-center text-indigo-400"
                        onClick={() => setHidden(false)}
                    >
                        <FontAwesomeIcon icon={faEyeSlash} size="lg"/> NSFW
                    </span>
                </div>
            )}
        </div>
    )
}

SafeImage.defaultProps = {
    nsfw: false,
    className: "",
    clickable: true
}

export default SafeImage
