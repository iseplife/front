import "./ImageOverlay.css"

type ImageOverlayProps = {
    src: string
    className?: string
    children?: React.ReactNode
}
const ImageOverlay: React.FC<ImageOverlayProps> = ({src, className, children}) => {
    return (
        <div className={`relative bg-neutral-700 ${className}`}>
            <div
                className="w-full h-full rounded opacity-50"
                style={{
                    backgroundImage: `url("${src}")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <span className="flex justify-center image-options opacity-100 absolute text-gray-400 z-10 whitespace-no-wrap">
                {children}
            </span>

        </div>
    )
}

ImageOverlay.defaultProps = {
    className: ""
}
export default ImageOverlay