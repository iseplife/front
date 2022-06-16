import { SafePhoto, setStyles, waitForFrame } from "../../util"
import Animated from "react-mount-animation"
import Lightbox from "./Lightbox"
import { RefObject, useEffect } from "react"
import { useCallback } from "react"
import { useState } from "react"

export interface SidebarProps<T extends SafePhoto> {
  currentImage: T
}

type LightboxProps<T extends (SafePhoto & {ref: RefObject<HTMLDivElement>})> = {
  show: boolean
  initialIndex: number
  photos: T[]
  Sidebar?: React.FC<SidebarProps<T>>
  onClose: () => void
  onChange?: (index: number) => void
}
const AnimatedLightbox = <T extends (SafePhoto & { ref: RefObject<HTMLDivElement> })>(props: LightboxProps<T>) => {
    const [showImage, setShowImage] = useState(false)
    const [animationDone, setAnimationDone] = useState(false)
    const firstImageCreatedCallback = useCallback((element: HTMLDivElement, photo: SafePhoto & { ref?: RefObject<HTMLDivElement> }) => {
        setAnimationDone(done => {
            (async () => {
                if(!done && photo.ref?.current){
                    const clone = photo.ref.current.cloneNode(true) as HTMLDivElement
                    let box = photo.ref.current.getBoundingClientRect()
                    clone.classList.remove("relative", "rounded-xl")
                    setStyles(clone, {
                        position: "fixed",
                        top: `${box.top}px`,
                        left: `${box.left}px`,
                        width: `${box.width}px`,
                        height: `${box.height}px`,
                        zIndex: 1000,
                        border: "none",
                        borderRadius: "12px",
                        transition: "top .2s ease-out, left .2s ease-out, width .2s ease-out, height .2s ease-out, opacity .1s, border-radius .25s"
                    })

                    document.documentElement.appendChild(clone)
                    clone.querySelector("img:not(.absolute)")?.remove()

                    await waitForFrame()

                    box = element.getBoundingClientRect()

                    setStyles(clone, {
                        top: `${box.top}px`,
                        left: `${box.left}px`,
                        width: `${box.width}px`,
                        height: `${box.height}px`,
                        maxHeight: "",
                        borderRadius: "0.1px"
                    })

                    clone.ontransitionend = async () => {
                        clone.ontransitionend = undefined!

                        setShowImage(true)
                        console.log("anim end")

                        await waitForFrame()
                        
                        setTimeout(() => {
                            clone.ontransitionend = () => {
                                console.log("remove")
                                clone.remove()
                            }
                            clone.style.opacity = "0"
                        }, 100)
                    }
                }
            })()
            return true
        })
    }, [])

    useEffect(() => {
        if(props.show){
            setShowImage(false)
            setAnimationDone(false)
        }
    }, [props.show])

    return <Animated.div
        className="fixed left-0 z-[999] top-0 bg-black/80 backdrop-blur-md backdrop-filter w-screen h-screen"
        show={props.show}
        mountAnim={`
            0% { opacity: 0;}
            100% {opacity: 1; }
        `}
        unmountAnim={`
            0% { opacity: 1; margin-top: 0px; pointer-events: none; }
            100% {opacity: 0; margin-top: 70px; pointer-events: none; }
        `}
        time={0.3}
        unmountTime={0.3}
        unmountTimingFunction="ease-out"
    >
        <Lightbox
            animated={true}
            showImage={showImage}
            firstImageCreatedCallback={firstImageCreatedCallback}
            {...props}
        />
    </Animated.div>
}

export {AnimatedLightbox}
