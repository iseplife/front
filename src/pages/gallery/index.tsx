import React, {useCallback, useEffect, useState} from "react"
import {Link, useParams} from "react-router-dom"
import {Gallery as GalleryType, Media as IsepLifeImage} from "../../data/gallery/types"
import {Avatar, message, Skeleton, Tooltip} from "antd"
import PhotoGallery, {PhotoProps} from "react-photo-gallery"
import GalleryLigthbox from "../../components/Gallery/GalleryLigthbox/GalleryLigthbox"
import {getGallery} from "../../data/gallery"
import LoadingGallery from "../../components/Gallery/LoadingGallery/LoadingGallery"
import {useTranslation} from "react-i18next"
import {useHistory} from "react-router-dom"
import {UserOutlined} from "@ant-design/icons"

/* We should create a GalleryService with them */
const getPhotosAsync = async (gallery: GalleryType): Promise<PhotoProps[]> => {
    return await Promise.all(gallery.previewImages.map<PromiseLike<PhotoProps>>((img: IsepLifeImage, index: number) =>
        parsePhoto(img.name, `${img.name}-${index}`)
    ))
}
const parsePhoto = (imgUrl: string, imgIndex: string): Promise<PhotoProps> => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = imgUrl
        image.onload = () => resolve({
            src: imgUrl,
            width: image.width,
            height: image.height,
            key: imgIndex
        })
    })
}

const Gallery: React.FC = () => {
    const {t} = useTranslation("gallery")
    const {id} = useParams()

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [gallery, setGallery] = useState<GalleryType>()
    const [photos, setPhotos] = useState<PhotoProps[]>([])

    const {pictureId} = useParams()
    const [isOpeningLigthbox, setOpenLigthbox] = useState<boolean>(false)
    const [currentPhoto, setCurrentPhoto] = useState<PhotoProps>()

    const history = useHistory()

    /*Gallery initialization*/
    useEffect(() => {
        if (id) {
            getGallery(id)
                .then(res => {
                    const galleryResponse = res.data
                    if (galleryResponse) {
                        setGallery(galleryResponse)
                        getPhotosAsync(galleryResponse)
                            .then((photos: PhotoProps[]) => {
                                setPhotos(photos)

                                if (pictureId) {
                                    setCurrentPhoto(photos[parseInt(pictureId)])
                                    setOpenLigthbox(true)
                                }
                            })
                            .catch(e => message.error(`Parse gallery's picture to photo type failed, ${e}`))
                            .finally(() => setIsLoading(false))
                    }
                })
                .catch(e => message.error(`Get this gallery failed ,${e}`))
        }
    }, [id, pictureId])

    const onCurrentPhotoChange = (photo: PhotoProps, index: number) => {
        setPhotos(photos)
        history.push(`/gallery/${id}/picture/${index}`)
    }

    const closeLightbox = () => {
        setOpenLigthbox(false)
        history.push(`/gallery/${id}`)
    }

    const openLightbox = useCallback((event, { photo, index }) => {
        if (photo) {
            setCurrentPhoto(photo)
            setOpenLigthbox(true)
            history.push(`/gallery/${id}/picture/${index}`)
        }
    }, [id, pictureId])

    return (
        <div className="w-5/6 mx-auto flex flex-col m-6 mb-20">
            <div className="flex flex-row">
                <Skeleton loading={isLoading} active paragraph={false} className="w-48 mr-2"/>
                <div className="font-bold text-xl text-blue-900 mt-2">{!!gallery && !isLoading ? gallery.name : ""}</div>
            </div>
            <div className="text-xs mt-2 mb-1 flex flex-row items-center">
                {!!gallery && !isLoading ? `${gallery.previewImages.length} ${t("pictures")}` : ""}
                <Skeleton loading={isLoading} active paragraph={false} className="w-20 mr-2"/>
            </div>
            <div className="flex flex-row bg-white p-1">
                {
                    isLoading
                        ? <LoadingGallery/>
                        : <PhotoGallery photos={photos} onClick={openLightbox} targetRowHeight={200} direction="row"/>
                }
            </div>
            {
                isLoading
                    ? (
                        <div className="flex flex-row items-center w-fit-content mt-2 h-16 mb-8 ml-auto">
                            <Skeleton loading={isLoading} active paragraph={false} className="mr-2 w-48"/>
                            <Skeleton avatar={true} loading={isLoading} active paragraph={false} title={false}/>
                        </div>
                    )
                    : (
                        <div className="h-16 mt-2 mb-4 w-full text-right mr-2">
                            {`${t("posted_date")} ${gallery ? new Date(gallery.creation).toLocaleDateString() : ""} ${t("by")}`}
                            <Tooltip title={gallery ? gallery.club.name : ""}>
                                <Link to={"/club/1"}>
                                    <Avatar shape="circle"
                                        className="w-12 h-12 ml-2 leading-tight hover:opacity-75 hover:shadow-outline cursor-pointer"
                                        icon={<UserOutlined/>} size="large"/>
                                </Link>
                            </Tooltip>
                        </div>
                    )
            }
            {
                isOpeningLigthbox && (<GalleryLigthbox photos={photos} onCurrentPhotoChange={onCurrentPhotoChange} onClose={closeLightbox} currentPhoto={currentPhoto}/>)
            }
        </div>
    )
}

export default Gallery