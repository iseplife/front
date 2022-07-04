import React, {useCallback, useEffect, useMemo, useState} from "react"
import {parsePhotosAsync} from "../../../util"
import SafeImage from "../../Common/SafeImage"
import {Image, MediaStatus} from "../../../data/media/types"
import {message} from "antd"
import PostSidebar from "../PostSidebar"
import {EmbedPseudoGallery, Post} from "../../../data/post/types"
import { AnimatedLightbox, AnimatedSafePhoto } from "../../Common/AnimatedLightbox"
import { feedsManager } from "../../../datamanager/FeedsManager"

type EmbedImagesProps = {
    images: Array<Image>
    post: Post
}
const EmbedImages: React.FC<EmbedImagesProps> = ({images, post}) => {
    const [photos, setPhotos] = useState<AnimatedSafePhoto[]>([])
    const [lightboxPhotoIndex, setLightboxPhotoIndex] = useState<number>()

    useEffect(() => {
        parsePhotosAsync(images).then(photos => 
            setPhotos(photos.map(photo => ({ ...photo, ref: React.createRef<HTMLDivElement>() })))
        ).catch(e => {
            message.error("Error while parsing...")
            console.error(e)
        })
    }, [images])
    
    const onLoadFactory = useCallback((id: number) => 
        () => {
            const embed = post.embed as EmbedPseudoGallery
            embed.images = embed.images.map(img => img.id == id ? {...img, status: MediaStatus.READY} : img)
            feedsManager.updatePost(post.id, { embed })
        }
    , [post.embed, post.id])

    const imagesComponent = useMemo(() => {
        const first = photos[0]
        return photos.length == 1 ?
            <div className="rounded-xl overflow-hidden relative border-[#dbe2e6] border cursor-pointer max-h-[400px]" style={{
                backgroundColor: `#${first.color}`,
                ...(first.ratio > 1 && {
                    width: "100%",
                }),
                aspectRatio: first.ratio.toString(),
            }}
            ref={first.ref}
            onClick={() => setLightboxPhotoIndex(0)}
            >
                <SafeImage onLoaded={onLoadFactory(first.id)} src={first.src} ratio={first.ratio} nsfw={first.nsfw} status={first.status} />
            </div>
            :
            <div className={`grid grid-cols-2 w-full gap-0.5 rounded-xl overflow-hidden border-[#dbe2e6] border ${photos.length >= 3 ? "h-64 lg:h-80" : "h-32 lg:h-40"}`}>
                {
                    photos.slice(0, 4).map((photo, index) => {
                        const longPhoto = photos.length == 3 && index == 0
                        
                        return <div style={{ backgroundColor: `#${photo.color}` }} className={
                            "relative overflow-hidden cursor-pointer h-full " +
                            (longPhoto && "row-span-2")
                        }
                        ref={photo.ref}
                        key={index}
                        onClick={() => setLightboxPhotoIndex(index)}
                        >
                            <SafeImage onLoaded={onLoadFactory(photo.id)} src={photo.src} ratio={photo.ratio} nsfw={photo.nsfw} status={photo.status} />
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
        <div className="block mx-3">
            {imagesComponent}
            <AnimatedLightbox
                show={lightboxPhotoIndex !== undefined}
                initialIndex={lightboxPhotoIndex as number}
                photos={photos}
                onClose={() => setLightboxPhotoIndex(undefined)}
                Sidebar={() => <PostSidebar post={post} />}
            />
        </div>
    )
}
export default EmbedImages
