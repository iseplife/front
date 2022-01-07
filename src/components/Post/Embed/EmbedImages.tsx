import React, {useCallback, useEffect, useState} from "react"
import {parsePhotosAsync, SafePhoto} from "../../../util"
import SafeImage from "../../Common/SafeImage"
import {Image} from "../../../data/media/types"
import PhotoGallery from "react-photo-gallery"
import {message} from "antd"
import Lightbox from "../../Common/Lightbox"
import PostSidebar from "../PostSidebar"
import {Post} from "../../../data/post/types"

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
            onClick={() => setLightboxPhotoIndex(index)}
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
