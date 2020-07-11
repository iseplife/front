import React from "react"
import "./ImageOverlay.css"

type ImageOverlayProps = {
    src: string
    height?: number
    width?: number
    className?: string
}
const ImageOverlay: React.FC<ImageOverlayProps> = ({src, height, width,className, children}) => {
	return (
		<div className={`${className} image-display relative`}>
			<span>
				<img src={src} alt="" style={{height: height || "auto", width: width || "auto"}}/>
			</span>
			<span className="image-options absolute text-gray-400">
				{children}
			</span>
		</div>
	)
}

ImageOverlay.defaultProps = {
	className: ""
}
export default ImageOverlay