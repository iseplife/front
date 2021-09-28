import React, {useCallback, useEffect, useState} from "react"
import {getPhotosAsync, PostPhoto } from "../../../util"
import SafeImage from "../../Common/SafeImage"
import {Image} from "../../../data/media/types"
import PhotoGallery from "react-photo-gallery"
import {message} from "antd"
import PostImageLightbox from "./PostImageLightbox"
import { Post } from "../../../data/post/types"

type EmbedImagesProps = {
    images: Array<Image>
    post: Post
}
const EmbedImages: React.FC<EmbedImagesProps> = ({images, post}) => {
    const [photos, setPhotos] = useState<PostPhoto[]>([])
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getPhotosAsync(images).then(photos => {
            setPhotos(photos)
        }).catch(e => {
            message.error("Error while parsing...")
            console.log(e)
        }).finally(() => setLoading(false))
    }, [images])

    const imageRenderer = useCallback(({index, photo}) => (
        <SafeImage
            key={index}
            nsfw={photo.nsfw}
            className="cursor-pointer"
            src={photo.src}
            height={photo.height}
            width={photo.width}
            onClick={() => setCurrentPhotoIndex(index)}
            alt={photo.alt}
        />
    ), [])


    return (
        <div className="flex flex-col flex-wrap">
            <PhotoGallery
                renderImage={imageRenderer}
                photos={photos}
                targetRowHeight={200}
                direction="row"
            />
            {currentPhotoIndex !== undefined && (
                <PostImageLightbox
                    post={post}
                    photos={photos}
                    currentPhotoIndex={currentPhotoIndex}
                    closeCallback={() => setCurrentPhotoIndex(undefined)}
                    setCurrentPhotoIndex={index => setCurrentPhotoIndex(index)}
                />
            )}
        </div>
    )
}
export default EmbedImages
