import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {mediaPath, SafePhoto} from "../../util"
import ImageContainer from "./ImageContainer"
import {GallerySizes} from "../../constants/MediaSizes"
import {createPortal} from "react-dom"
import { cFaArrow, cFaCross } from "../../constants/CustomFontAwesome"
import {MediaStatus} from "../../data/media/types"

export interface SidebarProps<T extends SafePhoto> {
    currentImage: T
}

type LightboxProps<T extends SafePhoto = SafePhoto> = {
    initialIndex: number
    photos: T[]
    Sidebar?: React.FC<SidebarProps<T>>
    onClose: () => void
    onChange?: (index: number) => void
}
const Lightbox = <T extends SafePhoto, >(props: LightboxProps<T>) => {
    const {photos, initialIndex, Sidebar, onClose, onChange} = props
    const [currentIndex, setCurrentIndex] = useState<number>(initialIndex)
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)

    const currentPhoto = useMemo(() => photos[currentIndex], [photos, currentIndex])

    const rightPanel = useRef<HTMLDivElement>(null)
    const sidePanel = useMemo(() => Sidebar && ( 
        <div
            className="md:bg-white flex-shrink-0 w-full md:w-96 rounded-tl-md rounded-bl-md overflow-auto md:block"
            ref={rightPanel}
        >
            <Sidebar currentImage={currentPhoto} />
        </div>
    ), [Sidebar])


    useEffect(() => {
        const handleResize = () => {
            const ratio = currentPhoto.width / currentPhoto.height

            const lbHeight = window.innerHeight
            const rpWidth = window.innerWidth >= 768 ?
                rightPanel?.current?.getBoundingClientRect().width ?? 0 :
                0

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
        handleResize()

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [currentPhoto, rightPanel])

    useEffect(() => {
        if (onChange) onChange(currentIndex)
    }, [currentIndex, onChange])

    return createPortal((
        <div>
            <div
                className="
                    flex flex-wrap md:flex-nowrap md:flex-row bg-black bg-opacity-80 fixed top-0 left-0
                    w-screen h-screen z-50 backdrop-blur-md backdrop-filter
                    max-w-full overflow-y-auto md:overflow-hidden
                "
            >
                <div className="w-full h-[77vh] md:h-full grid place-items-center relative">
                    <div className="w-full h-full absolute top-0 left-0" onClick={onClose}/>
                    <div
                        className="
                            absolute w-9 h-9 grid place-items-center m-3.5 bg-gray-800 bg-opacity-60
                            hover:bg-gray-700 hover:bg-opacity-50 transition-colors rounded-full
                            cursor-pointer z-50 top-0 left-0 text-white
                        "
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={cFaCross} className=""/>
                    </div>
                    <div className="relative m-auto">
                        {currentPhoto && height !== 0 && width !== 0 ?
                            <ImageContainer
                                key={currentIndex}
                                nsfw={currentPhoto.nsfw}
                                status={currentPhoto.status}
                                src={mediaPath(currentPhoto.srcSet as string, GallerySizes.LIGHTBOX)}
                                alt={currentPhoto.alt}
                                width={width}
                                height={height}
                                clickable={false}
                            /> :
                            <div>Erreur rencontrée</div>
                        }
                    </div>
                    {currentIndex + 1 < photos.length &&
                        <div
                            className="absolute right-0 h-9 w-9 grid place-items-center m-3 bg-gray-800 bg-opacity-60 hover:bg-gray-700 hover:bg-opacity-50 transition-colors rounded-full cursor-pointer z-50"
                            onClick={() => setCurrentIndex(idx => (idx + 1) % photos.length)}
                        >
                            <FontAwesomeIcon icon={cFaArrow} className="text-white w-4 h-4 transform rotate-180"/>
                        </div>
                    }
                    {currentIndex > 0 && 
                        <div
                            className="absolute left-0 h-9 w-9 grid place-items-center m-3 bg-gray-800 bg-opacity-60 hover:bg-gray-700 hover:bg-opacity-50 transition-colors rounded-full cursor-pointer z-50"
                            onClick={() => setCurrentIndex(idx => (idx + photos.length - 1) % photos.length)}
                        >
                            <FontAwesomeIcon icon={cFaArrow} className="text-white w-4 h-4"/>
                        </div>
                    }
                </div>
                {sidePanel}
            </div>
        </div>
    ), document.body)
}

export default Lightbox