import { SafePhoto, setStyles, waitForFrame } from "../../util"
import Animated from "react-mount-animation"
import Lightbox from "./Lightbox"
import React, { useEffect, useCallback, useState } from "react"
import { GallerySizes, PostSizes } from "../../constants/MediaSizes"

export interface SidebarProps<T extends SafePhoto> {
  currentImage: T
}

type LightboxProps<T extends AnimatedSafePhoto> = {
  show: boolean
  initialIndex: number
  photos: T[]
  Sidebar?: React.FC<SidebarProps<T>>
  gallery?: boolean
  onClose: () => void
  onChange?: (index: number) => void
  baseQualityName?: string
}
const AnimatedLightbox = <T extends AnimatedSafePhoto>(props: LightboxProps<T>) => {
    const [show, setShow] = useState(false)
    const [, setClone] = useState<HTMLDivElement>(undefined!)
    const [showImage, setShowImage] = useState(false)
    const [, setAnimationDone] = useState(false)
    const [lastLightboxPhotoIndex, setLastLightboxPhotoIndex] = useState<number>()

    useEffect(() => {
        if(props.initialIndex !== undefined)
            setLastLightboxPhotoIndex(props.initialIndex)
    }, [props.initialIndex])

    const firstImageCreatedCallback = useCallback((element: HTMLDivElement, photo: AnimatedSafePhoto) => {
        setAnimationDone(done => {
            setClone(clone => {
                (async () => {
                    if(!done && photo.ref?.current){
                        clone.style.visibility = ""
                            
                        await waitForFrame()

                        const box = element.getBoundingClientRect()
                        const lightbox = document.querySelector(".lightbox")

                        setStyles(clone, {
                            top: `${box.top-(lightbox?.getBoundingClientRect().top ?? 0)}px`,
                            left: `${box.left}px`,
                            width: `${box.width}px`,
                            height: `${box.height}px`,
                            margin: "0",
                            borderRadius: "0.1px"
                        })


                        clone.ontransitionend = async () => {
                            clone.ontransitionend = undefined!

                            setShowImage(true)

                            await waitForFrame()

                            setTimeout(() => {
                                clone.ontransitionend = () => 
                                    clone.remove()
                                clone.style.opacity = "0"
                            }, 50)
                            
                        }
                    }   
                })()
                return clone
            })
            return true
        })
    }, [])
    
    useEffect(() => {
        if (props.show) {
            setClone(undefined!)
            setShowImage(false)
            setAnimationDone(false)
        }else {
            setShow(false)
            
            setClone(clone => {
                if (clone) {
                    clone.ontransitionend = undefined!
                    clone.style.opacity = "0"
                    clone.ontransitionend = () => clone.remove()
                }
                return clone
            })
        }
    }, [props.show])

    const [wasShown, setWasShown] = useState(false)

    useEffect(() => {
        if (!wasShown && props.show && props.initialIndex !== undefined) {
            const photo = props.photos[props.initialIndex]
            if(photo?.ref.current){
                const clone = photo.ref.current.cloneNode(true) as HTMLDivElement
                const box = photo.ref.current.getBoundingClientRect()
                clone.classList.remove("relative", "rounded-xl")
                setStyles(clone, {
                    position: "fixed",
                    top: `${box.top}px`,
                    left: `${box.left}px`,
                    width: `${box.width}px`,
                    height: `${box.height}px`,
                    maxHeight: "initial",
                    zIndex: 1000,
                    pointerEvents: "none",
                    border: "none",
                    borderRadius: "12px",
                    visibility: "hidden",
                    transition: "top .2s ease-out, left .2s ease-out, width .2s ease-out, height .2s ease-out, opacity .1s, border-radius .25s"
                })

                clone.addEventListener("touchstart", (event) => event.preventDefault())

                
                document.documentElement.appendChild(clone)
                clone.querySelector("img:not(.absolute)")?.remove()
                const cloneImage = clone.querySelector<HTMLImageElement>("img")?.cloneNode(true) as HTMLImageElement
                cloneImage.src = cloneImage.src.replace(GallerySizes.PREVIEW, GallerySizes.LIGHTBOX)
                clone.appendChild(cloneImage)

                setClone(clone)

                const copiedImage = photo.ref.current.querySelector<HTMLImageElement>("img.absolute")
                if(copiedImage?.complete && copiedImage?.naturalHeight)
                    clone.querySelector<HTMLImageElement>("img.absolute")!.onload = () =>
                        setShow(true)
                else
                    setShow(true)
            } else {
                setAnimationDone(true)
                setShow(true)
                setShowImage(true)
            }
        }
        setWasShown(props.show)
    }, [props.initialIndex, props.show, wasShown])

    return (
        <Animated.div
            className="lightbox fixed left-0 z-[999] top-0 bg-black/80 backdrop-blur-md backdrop-filter sm:backdrop-filter-none w-screen h-screen"
            show={show}
            style={{animationFillMode: "forwards"}}
            mountAnim={`
                0% { opacity: 0; }
                100% {}
            `}
            unmountAnim={`
                100% { opacity: 0; margin-top: 70px; pointer-events: none; }
            `}
            time={0.3}
            unmountTimingFunction="ease-out"
        >
            <Lightbox
                animated={true}
                showImage={showImage}
                firstImageCreatedCallback={firstImageCreatedCallback}
                {...props}
                initialIndex={lastLightboxPhotoIndex!}
            />
        </Animated.div>
    )
}

export type AnimatedSafePhoto = SafePhoto & { ref: React.RefObject<HTMLDivElement> }
export {AnimatedLightbox}
