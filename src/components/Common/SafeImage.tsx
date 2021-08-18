import React, {ImgHTMLAttributes, useState} from "react"
import {IconFA} from "./IconFA"


type SafeImageProps = ImgHTMLAttributes<HTMLImageElement> & { nsfw: boolean, hide?: boolean }

const SafeImage: React.FC<SafeImageProps> = (props) => {
    const {nsfw, hide, ...imgProps} = props
    const safeMode = Boolean(localStorage.getItem("nsfw") || true)
    const [hidden, setHidden] = useState<boolean>(nsfw && safeMode)

    return (
        <div className={`${props.className} image-display relative bg-gray-400 overflow-hidden m-auto w-max rounded`}>
            <div className="overflow-hidden h-full w-full">
                <img
                    {...imgProps}
                    style={hidden ? {...props.style, WebkitFilter: "blur(12px)", filter: "blur(12px)", msFilter: "blur(12px)"} : {...props.style}}
                    alt={""}
                />
            </div>
            {hidden && !hide && (
                <div className="cursor-pointer" style={{left: "50%", top: "50%", position: "absolute", transform: "translate(-50%, -50%)"}}>
                    <span className="flex flex-col justify-center items-center text-indigo-400" onClick={() => setHidden(false)}>
                        <IconFA name="fa-eye-slash" size="lg" type="regular"/> NSFW
                    </span>
                </div>
            )}
        </div>
    )
}

SafeImage.defaultProps = {
    nsfw: false,
    className: ""
}

export default SafeImage
