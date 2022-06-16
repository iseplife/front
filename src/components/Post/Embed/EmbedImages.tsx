import React, {useCallback, useEffect, useMemo, useState} from "react"
import {parsePhotosAsync, SafePhoto} from "../../../util"
import SafeImage from "../../Common/SafeImage"
import {Image} from "../../../data/media/types"
import PhotoGallery from "react-photo-gallery"
import {message} from "antd"
import Lightbox from "../../Common/Lightbox"
import PostSidebar from "../PostSidebar"
import {Post} from "../../../data/post/types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type EmbedImagesProps = {
    images: Array<Image>
    post: Post
}
const EmbedImages: React.FC<EmbedImagesProps> = ({images, post}) => {
    const [photos, setPhotos] = useState<SafePhoto[]>([])
    const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        parsePhotosAsync(images).then(photos => {
            setPhotos(photos)
        }).catch(e => {
            message.error("Error while parsing...")
            console.error(e)
        }).finally(() => setLoading(false))
    }, [images])

    const imageRenderer = useCallback(({index, photo}) => (
        <SafeImage
            key={index}
            className="cursor-pointer"
            nsfw={photo.nsfw}
            status={photo.status}
            src={photo.src}
            height={photo.height}
            width={photo.width}
            onClick={() => setLightboxPhotoIndex(index)}
            alt={photo.alt}
        />
    ), [])

    const imagesComponent = useMemo(() => {
        const first = photos[0]
        return photos.length == 1 ?
            <div className="rounded-xl overflow-hidden relative border-[#dbe2e6] border" style={{
                backgroundColor: `#${first.color}`,
                ...(first.width > first.height ? {
                    width: "100%",
                } : {
                    maxHeight: "400px",
                }),
                aspectRatio: (first.width / first.height).toString(),
            }}>
                <img width={first.width} height={first.height} className="w-full h-full invisible" />
                <img src={first.src} alt="Image" className="w-full h-full absolute top-0" />
            </div>
            :
            <div className="grid grid-cols-2 w-full gap-0.5 rounded-xl overflow-hidden border-[#dbe2e6] border">
                {
                    photos.slice(0, 4).map((photo, index) => {
                        const longPhoto = photos.length == 3 && index == 0
                        
                        return <div style={{ backgroundColor: `#${photo.color}` }} className={
                            "relative overflow-hidden " +
                            (longPhoto && "row-span-2")
                        }>
                            <img src={photo.src} alt="Image" className={
                                "w-full h-44 xl:h-64 object-cover " +
                                (longPhoto && " !h-full xl:!h-full")
                            } />
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
            {lightboxPhotoIndex !== undefined && (
                <Lightbox
                    initialIndex={lightboxPhotoIndex}
                    photos={photos}
                    onClose={() => setLightboxPhotoIndex(undefined)}
                    Sidebar={() => <PostSidebar post={post} />}
                />
            )}
        </div>
    )
}
export default EmbedImages
