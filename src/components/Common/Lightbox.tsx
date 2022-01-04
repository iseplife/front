import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React, {useEffect, useMemo, useRef, useState} from "react"
import {faArrowLeft, faArrowRight, faTimes} from "@fortawesome/free-solid-svg-icons"
import {mediaPath, SafePhoto} from "../../util"
import SafeImage from "./SafeImage"
import {GallerySizes} from "../../constants/MediaSizes"
import {createPortal} from "react-dom"

type SidebarProps = {
    currentIndex: number,
    currentImage: SafePhoto
}

type LightboxProps = {
    initialIndex: number
    photos: SafePhoto[]
    Sidebar?: React.FC<SidebarProps>
    onClose: () => void,
}
const Lightbox: React.FC<LightboxProps> = ({photos, initialIndex, Sidebar, onClose}) => {
    const [currentIndex, setCurrentIndex] = useState<number>(initialIndex)
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)

    const currentPhoto = useMemo(() => photos[currentIndex], [photos, currentIndex])
    const rightPanel = useRef<HTMLDivElement>(null)


    useEffect(() => {
        const handleResize = () => {
            if (rightPanel && rightPanel.current) {
                const ratio = currentPhoto.width / currentPhoto.height
                let {width: rpWidth, height: lbHeight} = rightPanel.current.getBoundingClientRect()
                lbHeight = lbHeight || window.innerHeight
                rpWidth = rpWidth ?? 0

                const lbWidth = window.innerWidth - rpWidth

                const lbRatio = lbWidth / lbHeight

                if (ratio > lbRatio) {
                    setWidth(lbWidth)
                    setHeight(lbWidth / ratio)
                } else {
                    setWidth(ratio * lbHeight)
                    setHeight(lbHeight)
                }
            }
        }
        handleResize()

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [currentPhoto, rightPanel])

    return createPortal((
        <div>
            <div
                className="flex bg-black bg-opacity-80 fixed top-0 left-0 w-screen h-screen z-50 backdrop-blur-md backdrop-filter max-w-full">
                <div className="w-full grid place-items-center relative">
                    <div className="w-full h-full absolute top-0 left-0" onClick={onClose}/>
                    <div
                        className="absolute p-3 m-1 text-gray-400 hover:text-white transition-colors rounded-full cursor-pointer z-50 top-0 left-0"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5"/>
                    </div>
                    <div className="relative m-auto">
                        <SafeImage
                            key={currentIndex}
                            nsfw={currentPhoto.nsfw}
                            src={mediaPath(currentPhoto.srcSet as string, GallerySizes.LIGHTBOX)}
                            alt={currentPhoto.alt}
                            width={width}
                            height={height}
                            clickable={false}
                        />
                    </div>
                    {currentIndex + 1 < photos.length &&
                        <div
                            className="absolute right-0 p-2.5 m-3 bg-gray-800 bg-opacity-60 hover:bg-gray-700 hover:bg-opacity-50 transition-colors rounded-full cursor-pointer z-50"
                            onClick={() => setCurrentIndex(idx => idx + 1)}
                        >
                            <FontAwesomeIcon icon={faArrowRight} className="text-white w-4 h-4"/>
                        </div>
                    }
                    {currentIndex > 0 &&
                        <div
                            className="absolute left-0 p-2.5 m-3 bg-gray-800 bg-opacity-60 hover:bg-gray-700 hover:bg-opacity-50 transition-colors rounded-full cursor-pointer z-50"
                            onClick={() => setCurrentIndex(idx => idx - 1)}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="text-white w-4 h-4"/>
                        </div>
                    }
                </div>
                {Sidebar && (
                    <div
                        className="bg-white flex-shrink-0 w-96 rounded-tl-md rounded-bl-md overflow-auto hidden md:block"
                        ref={rightPanel}
                    >
                        <Sidebar currentImage={currentPhoto} currentIndex={currentIndex}/>
                    </div>
                )}
            </div>
        </div>
    ), document.body)
}

export default Lightbox