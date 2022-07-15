import "./ImageOverlay.css"

type ImageOverlayProps = {
    src: string
    className?: string
    children?: React.ReactNode
}
const ImageOverlay: React.FC<ImageOverlayProps> = ({src, className, children}) => {
    return (
        <div className={`image-display relative bg-gray-400 ${className}`}>
            <div
                className="w-full h-full rounded"
                style={{
                    backgroundImage: `url("${src}")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <span className="flex justify-center image-options absolute text-gray-400 z-10 whitespace-no-wrap">
                {children}
            </span>

        </div>
    )
}

ImageOverlay.defaultProps = {
    className: ""
}
export default ImageOverlay