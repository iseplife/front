import React, {useCallback, useEffect, useState} from "react"
import {defaultPhotoParser, parsePhotosAsync, ProcessableImage, SafePhoto} from "../../../util"
import ImageContainer from "../../Common/ImageContainer"
import {Image as ImageType, MediaStatus} from "../../../data/media/types"
import PhotoGallery from "react-photo-gallery"
import {message} from "antd"
import Lightbox from "../../Common/Lightbox"
import PostSidebar from "../PostSidebar"
import {Post} from "../../../data/post/types"

type EmbedImagesProps = {
    images: Array<ImageType>
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

    const imageFinishedProcessing = useCallback( (index : number) => () => {
        const image: ProcessableImage = {
            id: +(photos[index].key),
            name: photos[index].srcSet as string,
            nsfw: photos[index].nsfw,
            status: MediaStatus.READY
        }

        defaultPhotoParser(image, photos[index].key).then(photo => {
            setPhotos(prevPhotos => prevPhotos.map(p => p.key == photo.key ? photo : p))
        })
    }, [photos])

    const imageRenderer = useCallback(({index, photo}) => (
        <ImageContainer
            id={photo.key as never}
            key={index}
            className="cursor-pointer"
            nsfw={photo.nsfw}
            status={photo.status}
            src={photo.src}
            height={photo.height}
            width={photo.width}
            onClick={() => setLightboxPhotoIndex(index)}
            onProcessingFinished={imageFinishedProcessing(index)}
            alt={photo.alt}
        />
    ), [])


    return (
        <div className="flex flex-col flex-wrap mx-3">
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
