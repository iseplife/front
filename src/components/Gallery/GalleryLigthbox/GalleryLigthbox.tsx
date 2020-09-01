import React, {RefObject, useEffect, useLayoutEffect, useRef, useState} from "react"
import {Avatar, Button, Carousel} from "antd"
import style from "./GalleryLigthbox.module.css"
import {CarouselProps} from "antd/es/carousel"
import {useTranslation} from "react-i18next"
import {
    CloseOutlined,
    LeftOutlined,
    RightOutlined,
    DownloadOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined
} from "@ant-design/icons"
import {Image} from "../../../data/media/types"
import {GallerySizes} from "../../../constants/MediaSizes";
import {mediaPath} from "../../../util";

// Carousel slide move
const slideLeft = (carouselRef: RefObject<Carousel>): void => {
    if (carouselRef?.current)
        carouselRef.current.prev()
}
const slideRigth = (carouselRef: RefObject<Carousel>): void => {
    if (carouselRef?.current)
        carouselRef?.current.next()
}

const TIME_PER_SLIDE = 1000

type GalleryLigthboxProps = {
    photos: Image[]
    current: Image | undefined
    sizes?: {LIGHTBOX: string, PREVIEW: string}
    onCurrentPhotoChange(photo: Image, index: number): void
    onClose(): void
}
const GalleryLigthbox: React.FC<GalleryLigthboxProps> = ({photos, sizes, current, onCurrentPhotoChange, onClose}) => {
    const {t} = useTranslation("gallery")
    const [autoPlay, setAutoPlay] = useState<boolean>(false)
    const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout>()
    const carouselRef = useRef<Carousel>(null)
    const dotListRef = useRef<HTMLUListElement>(null)

    /**
     * Set up event listener on keyboard arrows on first load
     */
    useLayoutEffect(() => {
        // Carousel slide with keyboard control
        const handleKeyboardPressAction = (carouselRef: RefObject<Carousel>, event: KeyboardEvent) => {
            if (event.key === "ArrowLeft")
                slideLeft(carouselRef)
            if (event.key === "ArrowRight")
                slideRigth(carouselRef)
        }
        window.addEventListener("keydown", (e) => handleKeyboardPressAction(carouselRef, e))

        return () => window.removeEventListener("keydown", (e) => handleKeyboardPressAction(carouselRef, e))
    }, [])

    /**
     *  Set up scroll managements of dots on the lightbox on first load
     */
    useEffect(() => {
        if (dotListRef.current) {
            const dots = dotListRef.current.children
            for (let i = 0; i < dots.length; i++) {
                const dot = dots.item(i)
                if (dot?.classList.contains("slick-active")) {
                    dot.scrollIntoView({behavior: "smooth"})
                    break
                }
            }
        }
    }, [])

    /**
     * Starts setInterval when enabling autoPlay and disable it when autoplay is turned off
     */
    useEffect(() => {
        if (autoPlay) {
            setAutoPlayInterval(setInterval(() => slideRigth(carouselRef), TIME_PER_SLIDE))

            return () => clearInterval(autoPlayInterval as NodeJS.Timeout)
        } else {
            clearInterval(autoPlayInterval as NodeJS.Timeout)
        }
    }, [autoPlay, autoPlayInterval])

    const carouselProps: CarouselProps = {
        dots: true,
        fade: true,
        infinite: true,
        swipeToSlide: true,
        swipe: true,
        accessibility: true,
        cssEase: "linear",
        initialSlide: current && photos.length ? photos.findIndex(p => p.id === current.id) : 0,
        afterChange: (currentSlideIndex: number) => onCurrentPhotoChange(photos[currentSlideIndex], currentSlideIndex),
        customPaging: (i: number) => (
            <Button className="w-10 h-10 bg-transparent">
                <Avatar
                    src={mediaPath(photos[i].name, sizes?.PREVIEW)}
                    shape="square"
                    size="large"
                    className="w-10 h-10 hover:border-white hover:shadow-md hover:w-12 hover:h-12"
                />
            </Button>
        ),
        appendDots: (dots: React.ReactNode) => (
            <div className="pb-4">
                <ul ref={dotListRef}
                    className={"w-3/4 mx-auto overflow-x-scroll overflow-y-hidden mb-0 h-14 whitespace-no-wrap " + style.customScrollBar}>
                    {dots}
                </ul>
            </div>
        ),
    }

    return (
        <div className="fixed z-30 top-0 left-0 bg-black w-full h-full flex flex-col">
            <div className="w-full h-20">
                <CloseOutlined style={{color: "white"}} className="text-xl m-4 float-right" onClick={onClose}/>
            </div>
            <div className={"w-full flex flex-row items-center " + style.galleryLightboxBody}>
                <div className="m-4 absolute z-30 text-center left-0  hidden sm:block md:block lg:block">
                    <LeftOutlined
                        className="text-white p-4 w-12 h-12 hover:bg-gray-900 rounded-full"
                        onClick={() => slideLeft(carouselRef)}
                    />
                </div>
                <div className="w-full p-4">
                    <Carousel {...carouselProps} autoplay={autoPlay} ref={carouselRef}>
                        {photos.map((photo: Image, index: number) => (
                            <div key={photo.name + "/" + index}>
                                <div className={style.carouselContent}>
                                    <img src={mediaPath(photo.name, sizes?.LIGHTBOX)} className={style.carouselImage}/>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
                <div className="m-4 text-center absolute z-30 right-0 hidden sm:block md:block lg:block">
                    <RightOutlined
                        className="text-white p-4 w-12 h-12 hover:bg-gray-900 rounded-full"
                        onClick={() => slideRigth(carouselRef)}
                    />
                </div>
            </div>
            <div className="mx-auto flex h-20 items-center">
                <Button
                    type="default"
                    icon={autoPlay ? <PauseCircleOutlined/> : <PlayCircleOutlined/>}
                    onClick={() => setAutoPlay(!autoPlay)}
                    className={"w-22 h-12 mr-6 flex items-center text-md text-white border-none " + (autoPlay ? "bg-gray-500" : "bg-gray-900")}
                >
                    {autoPlay ? `${t("stop")}` : `${t("play")}`}
                </Button>
                <Button
                    type="default"
                    icon={<DownloadOutlined/>}
                    className="w-22 h-12 flex items-center text-md text-white border-none bg-gray-900"
                    href={current?.name}
                    download={`@prodIsepLife/${current?.name ||  "undefined"}`}
                >
                    {t("download")}

                </Button>
            </div>
        </div>
    )
}
GalleryLigthbox.defaultProps = {
    sizes: GallerySizes
}

export default GalleryLigthbox