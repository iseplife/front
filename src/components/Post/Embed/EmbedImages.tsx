import React, {useEffect, useMemo, useRef, useState} from "react"
import {parsePhotosAsync, SafePhoto} from "../../../util"
import SafeImage from "../../Common/SafeImage"
import {Image} from "../../../data/media/types"
import {message} from "antd"
import Lightbox from "../../Common/Lightbox"
import PostSidebar from "../PostSidebar"
import {Post} from "../../../data/post/types"
import Animated from "react-mount-animation"
import { AnimatedLightbox } from "../../Common/AnimatedLightbox"

type EmbedImagesProps = {
    images: Array<Image>
    post: Post
}
const EmbedImages: React.FC<EmbedImagesProps> = ({images, post}) => {
    const [photos, setPhotos] = useState<(SafePhoto & { ref: React.RefObject<HTMLDivElement> })[]>([])
    const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number>()
    const [lastLightboxPhotoIndex, setLastLightboxPhotoIndex] = useState<number>()
    const a = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if(lightboxPhotoIndex !== undefined)
            setLastLightboxPhotoIndex(lightboxPhotoIndex)
    }, [lightboxPhotoIndex])

    useEffect(() => {
        parsePhotosAsync(images).then(photos => 
            setPhotos(photos.map(photo => ({ ...photo, ref: React.createRef<HTMLDivElement>() })))
        ).catch(e => {
            message.error("Error while parsing...")
            console.error(e)
        })
    }, [images])
    

    const imagesComponent = useMemo(() => {
        const first = photos[0]
        return photos.length == 1 ?
            <div className="rounded-xl overflow-hidden relative border-[#dbe2e6] border cursor-pointer" style={{
                backgroundColor: `#${first.color}`,
                ...(first.width > first.height ? {
                    width: "100%",
                } : {
                    maxHeight: "400px",
                }),
                aspectRatio: (first.width / first.height).toString(),
            }}
            ref={first.ref}
            onClick={() => setLightboxPhotoIndex(0)}
            >
                <SafeImage src={first.src} height={first.height} width={first.width} nsfw={first.nsfw} status={first.status} />
            </div>
            :
            <div className="grid grid-cols-2 w-full gap-0.5 rounded-xl overflow-hidden border-[#dbe2e6] border">
                {
                    photos.slice(0, 4).map((photo, index) => {
                        const longPhoto = photos.length == 3 && index == 0
                        
                        return <div style={{ backgroundColor: `#${photo.color}` }} className={
                            "relative overflow-hidden cursor-pointer " +
                            (longPhoto && "row-span-2")
                        }
                        ref={photo.ref}
                        key={index}
                        onClick={() => setLightboxPhotoIndex(index)}
                        >
                            <SafeImage src={photo.src} height={photo.height} width={photo.width} nsfw={photo.nsfw} status={photo.status} />
                            {index == 3 && photos.length > 4 &&
                                <div className="w-full h-full absolute top-0 left-0 bg-neutral-800/60 backdrop-blur-lg text-white grid place-items-center text-4xl font-bold">
                                    + {photos.length - 3}
                                </div>
                            }
                        </div>
                    })
                }
            </div>
    }, [photos])


    return (
        <div className="flex flex-col mx-3">
            {imagesComponent}
            <AnimatedLightbox
                show={lightboxPhotoIndex !== undefined}
                initialIndex={lastLightboxPhotoIndex as number}
                photos={photos}
                onClose={() => setLightboxPhotoIndex(undefined)}
                Sidebar={() => <PostSidebar post={post} />}
            />
        </div>
    )
}
export default EmbedImages
