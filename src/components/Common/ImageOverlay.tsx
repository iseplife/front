import React, {CSSProperties} from "react";
import "./ImageOverlay.css";

type ImageOverlayProps = {
    src?: string
    height?: number
    width?: number
    className?: string
    style?: CSSProperties
}
const ImageOverlay: React.FC<ImageOverlayProps> = ({src, height, width, children}) => {
    return (
        <div className="image-display relative">
            <span>
                <img src={src} alt="" style={{height: height || "auto", width: width || "auto"}}/>
            </span>
            <span className="image-options absolute text-gray-400">
                {children}
            </span>
        </div>
    )
}

export default ImageOverlay;