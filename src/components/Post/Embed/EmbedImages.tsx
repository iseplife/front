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
            <div className="rounded-xl overflow-hidden" style={{
                backgroundColor: `#${first.color}`,
                ...(first.width > first.height ? {
                    width: "100%",
                } : {
                    maxHeight: "400px",
                }),
                aspectRatio: (first.width / first.height).toString(),
            }}>
                <img src={first.src} alt="Image" className="w-full h-full" />
            </div>
            :
            <div className="grid grid-cols-2 w-full gap-0.5">
                {
                    photos.slice(0, 4).map((photo, index) => {
                        const duo = photos.length == 2,
                            trio = photos.length == 3,
                            square = photos.length >= 4
                        
                        const longPhoto = trio && index == 0
                        
                        const hasBottom = duo || (trio && (index != 1)) || (square && index > 1)
                        const hasTop = duo || (trio && (index != 2)) || (square && index <= 1)
                        const hasRight = index != 0 && (!square || index != 2)
                        const hasLeft = index == 0 || (square && index == 2)

                        return <div style={{ backgroundColor: `#${photo.color}` }} className={
                            "relative rounded-xl overflow-hidden " +
                            (longPhoto && "row-span-2") +
                            (!hasRight && " rounded-r-none ") +
                            (!hasLeft && " rounded-l-none ") +
                            (!hasBottom && " rounded-b-none ") +
                            (!hasTop && " rounded-t-none ")
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
        <div className="flex flex-col flex-wrap mx-3">
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
