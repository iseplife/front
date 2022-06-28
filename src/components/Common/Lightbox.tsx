import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {mediaPath, SafePhoto} from "../../util"
import SafeImage from "./SafeImage"
import {GallerySizes} from "../../constants/MediaSizes"
import { cFaArrow, cFaCross } from "../../constants/CustomFontAwesome"
import { useTranslation } from "react-i18next"
import { AnimatedSafePhoto } from "./AnimatedLightbox"

export interface SidebarProps<T extends SafePhoto> {
    currentImage: T
}

type LightboxProps<T extends AnimatedSafePhoto> = {
    animated?: boolean
    showImage?: boolean
    initialIndex: number
    firstImageCreatedCallback?: (element: HTMLDivElement, photo: AnimatedSafePhoto) => void
    photos: T[]
    Sidebar?: React.FC<SidebarProps<T>>
    onClose: () => void
    onChange?: (index: number) => void
}
const Lightbox = <T extends AnimatedSafePhoto>(props: LightboxProps<T>) => {
    const {photos, animated, showImage, firstImageCreatedCallback, initialIndex, Sidebar, onClose, onChange} = props
    const [currentIndex, _setCurrentIndex] = useState<number>(initialIndex)
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const {t} = useTranslation("common")

    const currentPhoto = useMemo(() => photos[currentIndex], [photos, currentIndex])

    const rightPanel = useRef<HTMLDivElement>(null)
    const sidePanel = useMemo(() => Sidebar && ( 
        <div
            className="md:bg-white flex-shrink-0 w-full md:w-96 rounded-t-xl md:rounded-none md:rounded-tl-md md:rounded-bl-md overflow-auto md:block z-50 bg-neutral-500/50"
            ref={rightPanel}
        >
            <Sidebar currentImage={currentPhoto} />
        </div>
    ), [Sidebar])

    useEffect(() => 
        _setCurrentIndex(initialIndex)
    , [initialIndex])

    const photoRef = useRef<HTMLDivElement>(null)

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

        requestAnimationFrame(_ => firstImageCreatedCallback?.(photoRef.current!, currentPhoto))

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [currentPhoto, rightPanel, firstImageCreatedCallback])

    const setCurrentIndex = useCallback((fct: (index: number) => number) => {
        _setCurrentIndex((index: number) => {
            const result = fct(index)
            if (onChange) onChange(result)
            return result
        })
        
    }, [initialIndex, onChange])

    return <div
        className={`
            flex flex-wrap md:flex-nowrap md:flex-row 
            w-screen h-screen z-50 
            max-w-full overflow-y-auto md:overflow-hidden 
            ${!animated && " fixed top-0 left-0 bg-black/80 backdrop-blur-md backdrop-filter"}
        `}
    >
        <div className="select-none w-full h-[77vh] md:h-full grid place-items-center relative">
            <div className="w-full h-full absolute top-0 left-0" onClick={onClose}/>
            <div
                className={`
                    absolute w-9 h-9 grid place-items-center m-3.5 bg-gray-800 bg-opacity-60
                    hover:bg-gray-700 hover:bg-opacity-50 rounded-full
                    cursor-pointer z-50 top-0 left-0 text-white transition-all duration-300 ${showImage == false && "opacity-0"}
                `}
                onClick={onClose}
            >
                <FontAwesomeIcon icon={cFaCross}/>
            </div>
            <div className={"relative m-auto " + (showImage == false && "opacity-0")} style={{width, height}} ref={photoRef}>
                {currentPhoto && height !== 0 && width !== 0 ?
                    <SafeImage
                        skipNsfw={initialIndex == currentIndex}
                        key={currentIndex}
                        nsfw={currentPhoto.nsfw}
                        status={currentPhoto.status}
                        lowQualitySrc={mediaPath(currentPhoto.srcSet as string, GallerySizes.PREVIEW)}
                        src={mediaPath(currentPhoto.srcSet as string, GallerySizes.LIGHTBOX)}
                        alt={currentPhoto.alt}
                        ratio={currentPhoto.ratio}
                    /> :
                    <div>{t("error")}</div>
                }
            </div>
            {currentIndex + 1 < photos.length &&
                <div
                    className={`
                        absolute right-0 h-9 w-9 grid place-items-center m-3 bg-gray-800 bg-opacity-60 
                        hover:bg-gray-700 hover:bg-opacity-50 rounded-full cursor-pointer 
                        z-50 transition-all duration-300 ${showImage == false && "opacity-0"}
                    `}
                    onClick={() => setCurrentIndex(idx => (idx + 1) % photos.length)}
                >
                    <FontAwesomeIcon icon={cFaArrow} className="text-white w-4 h-4 transform rotate-180"/>
                </div>
            }
            {currentIndex > 0 && 
                <div
                    className={`
                        absolute left-0 h-9 w-9 grid place-items-center m-3 bg-gray-800 bg-opacity-60 
                        hover:bg-gray-700 hover:bg-opacity-50 rounded-full cursor-pointer 
                        z-50 transition-all duration-300 ${showImage == false && "opacity-0"}
                    `}
                    onClick={() => setCurrentIndex(idx => (idx + photos.length - 1) % photos.length)}
                >
                    <FontAwesomeIcon icon={cFaArrow} className="text-white w-4 h-4"/>
                </div>
            }
        </div>
        {sidePanel}
    </div>
}

export default Lightbox