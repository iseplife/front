import React, {RefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import {PhotoProps} from "react-photo-gallery";
import {Avatar, Button, Carousel, Icon} from "antd";
import style from "./GalleryLigthbox.module.css";
import {CarouselProps} from "antd/es/carousel";
import {useTranslation} from "react-i18next";

// Carousel slide move
const slideLeft = (carouselRef: RefObject<Carousel>): void => {
    if (!!carouselRef && !!carouselRef.current) {
        carouselRef.current.prev();
    }
};
const slideRigth = (carouselRef: RefObject<Carousel>): void => {
    if (!!carouselRef && !!carouselRef.current) {
        carouselRef.current.next();
    }
};


export type GalleryLigthboxProps = {
    photos: PhotoProps[];
    currentPhoto: PhotoProps | undefined;
    onCurrentPhotoChange(photo: PhotoProps, index: number): void;
    onClose(): void;
}

const TIME_PER_SLIDE = 200;

const GalleryLigthbox: React.FC<GalleryLigthboxProps> = ({photos, currentPhoto, onCurrentPhotoChange, onClose}) => {
    const {t} = useTranslation('gallery');
    const [autoPlay, setAutoPlay] = useState<boolean>(false);
    const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout>();
    const carouselRef = useRef<Carousel>(null);
    const dotListRef = useRef<HTMLUListElement>(null);

    /**
     * Set up event listener on keyboard arrows on first load
     */
    useLayoutEffect(() => {
        // Carousel slide with keyboard control
        const handleKeyboardPressAction = (carouselRef: RefObject<Carousel>, event: any) => {
            if (event.key === "ArrowLeft") {
                slideLeft(carouselRef);
            }
            if (event.key === "ArrowRight") {
                slideRigth(carouselRef);
            }
        };
        window.addEventListener('keydown', (e) => handleKeyboardPressAction(carouselRef, e));

        return () => window.removeEventListener('keydown', (e) => handleKeyboardPressAction(carouselRef, e));
    }, []);

    /**
     *  Set up scroll managements of dots on the lightbox on first load
     */
    useEffect(() => {
        if (!!dotListRef.current) {
            const dots = dotListRef.current.children;
            for (let i = 0; i < dots.length; i++) {
                const dot = dots.item(i);
                if (!!dot && dot.classList.contains("slick-active")) {
                    dot.scrollIntoView({behavior: "smooth"});
                    break;

                }
            }
        }
    }, []);

    /**
     * Starts setInterval when enabling autoPlay and disable it when autoplay is turned off
     */
    useEffect(() => {
        if (autoPlay) {
            setAutoPlayInterval(setInterval(() => slideRigth(carouselRef), TIME_PER_SLIDE));

            return () => clearInterval(autoPlayInterval as NodeJS.Timeout);
        } else {
            clearInterval(autoPlayInterval as NodeJS.Timeout)
        }
    }, [autoPlay]);

    const carouselProps: CarouselProps = {
        dots: true,
        fade: true,
        infinite: true,
        swipeToSlide: true,
        swipe: true,
        accessibility: true,
        cssEase: "linear",
        initialSlide: !!currentPhoto && !!photos.length ? photos.findIndex((p) => p.key === currentPhoto.key) : 0,
        afterChange: (currentSlideIndex: number) => onCurrentPhotoChange(photos[currentSlideIndex], currentSlideIndex),
        customPaging: (i: number) => (
            <Button className="w-10 h-10 bg-transparent">
                <Avatar src={photos[i].src} shape="square" size="large"
                        className="w-10 h-10 hover:border-white hover:shadow-md hover:w-12 hover:h-12"/>
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
    };

    return (
        <div className="fixed z-30 top-0 left-0 bg-black w-full h-full flex flex-col">
            <div className="w-full h-20">
                <Icon type="close" style={{color: "white"}} className="text-xl m-4 float-right" onClick={onClose}/>
            </div>
            <div className={"w-full flex flex-row items-center " + style.galleryLightboxBody}>
                <div className="m-4 absolute z-30 text-center left-0  hidden sm:block md:block lg:block">
                    <Icon type="left" onClick={() => slideLeft(carouselRef)}
                          className="text-white p-4 w-12 h-12 hover:bg-gray-900 rounded-full"/>
                </div>
                <div className="w-full p-4">
                    <Carousel {...carouselProps} autoplay={autoPlay} ref={carouselRef}>
                        {
                            photos.map((photo: PhotoProps, index: number) => {
                                return (
                                    <div key={photo.src + "/" + index}>
                                        <div className={style.carouselContent}>
                                            <img src={photo.src} className={style.carouselImage}/>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </Carousel>
                </div>
                <div className="m-4 text-center absolute z-30 right-0 hidden sm:block md:block lg:block">
                    <Icon type="right" onClick={() => slideRigth(carouselRef)}
                          className="text-white p-4 w-12 h-12 hover:bg-gray-900 rounded-full"/>
                </div>
            </div>
            <div className="mx-auto flex h-20 items-center">
                <Button type="default" icon={autoPlay ? "pause-circle" : "play-circle"}
                        onClick={() => setAutoPlay(!autoPlay)}
                        className={"w-22 h-12 mr-6 flex items-center text-md text-white border-none " + (autoPlay ? "bg-gray-500" : "bg-gray-900")}>{autoPlay ? `${t("stop")}` : `${t("play")}`}</Button>
                <Button type="default" icon="download"
                        className="w-22 h-12 flex items-center text-md text-white border-none bg-gray-900"
                        href={!!currentPhoto ? currentPhoto.src : ""}
                        download={`@prodIsepLife/${!!currentPhoto ? currentPhoto.src : "undefined"}`}>{t("download")}</Button>
            </div>
        </div>
    );
};

export default GalleryLigthbox;