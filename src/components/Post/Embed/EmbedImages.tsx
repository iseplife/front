import React, {useCallback, useEffect, useMemo, useState} from "react"
import {getPostLink, parsePhotosAsync} from "../../../util"
import SafeImage from "../../Common/SafeImage"
import {Image, MediaStatus} from "../../../data/media/types"
import {message} from "antd"
import PostSidebar from "../PostSidebar"
import {EmbedPseudoGallery, Post} from "../../../data/post/types"
import { AnimatedLightbox, AnimatedSafePhoto } from "../../Common/AnimatedLightbox"
import { feedsManager } from "../../../datamanager/FeedsManager"
import { useLocation } from "react-router-dom"

type EmbedImagesProps = {
    images: Array<Image>
    post: Post
    selected?: boolean
}
const EmbedImages: React.FC<EmbedImagesProps> = ({images, post, selected}) => {
    const [photos, setPhotos] = useState<AnimatedSafePhoto[]>([])
    const [lightboxPhotoIndex, _setLightboxPhotoIndex] = useState<number>()

    useEffect(() => {
        parsePhotosAsync(images).then(photos => 
            setPhotos(photos.map(photo => ({ ...photo, ref: React.createRef<HTMLDivElement>() })))
        ).catch(e => {
            message.error("Error while parsing...")
            console.error(e)
        })
    }, [images])

    const {pathname} = useLocation()

    const originalLink = useMemo(() => {
        let splitted = pathname.split("/")
        splitted = splitted.slice(1, 3)
        return `/${splitted.join("/")}`
    }, [])

    const [openned, setOpenned] = useState(false)

    useEffect(() => {
        const fnc = () => window.location.pathname == originalLink && lightboxPhotoIndex !== undefined && _setLightboxPhotoIndex(undefined)
        window.addEventListener("popstate", fnc)
        return () => window.removeEventListener("popstate", fnc)
    }, [lightboxPhotoIndex, originalLink])

    const setLightboxPhotoIndex = useCallback((index?: number) => {
        const link = index === undefined ? originalLink : `/${getPostLink(post, false)}/${index}`
        if (lightboxPhotoIndex !== undefined && index === undefined) {
            setOpenned(openned => {
                if(openned)
                    window.history.back()
                else
                    window.history.replaceState(null, "", link)
                return false
            })
        } else
            window.history.replaceState(null, "", link)
        _setLightboxPhotoIndex(index)
    }, [post.id, post.context, originalLink, lightboxPhotoIndex])

    const open = useCallback((index: number) => {
        setOpenned(true)
        const link = `/${getPostLink(post, false)}/${index}`
        window.history.pushState(null, "", link)
        _setLightboxPhotoIndex(index)
    }, [post.id, post.context])

    useEffect(() => {
        const splitted = pathname.split("/")
        splitted.shift()
        const postIndex = splitted.indexOf("post")
        if (
            splitted[splitted.length - 2] == post.id.toString()
            && postIndex != -1 && splitted.length == postIndex + 3
            && photos.length
        ) {
            setTimeout(() => {
                console.log("open", selected, !document.querySelector(".lightbox"))
                if(!document.querySelector(".lightbox")){
                    const index = +splitted[splitted.length - 1]
                    _setLightboxPhotoIndex(index)
                }
            }, selected ? 300 : 0)
        }
    }, [!!photos.length, pathname, selected])

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
            onClick={() => open(0)}
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
                        onClick={() => open(index)}
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
                onClose={() => setLightboxPhotoIndex()}
                Sidebar={() => <PostSidebar post={post} />}
                onChange={setLightboxPhotoIndex}
            />
        </div>
    )
}
export default EmbedImages
