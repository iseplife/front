import React, {useCallback, useEffect, useState} from "react"
import {Link, useParams} from "react-router-dom"
import {Gallery as GalleryType} from "../../data/gallery/types"
import {Avatar, Button, message, Modal, Skeleton, Tooltip} from "antd"
import PhotoGallery, {PhotoProps, renderImageClickHandler} from "react-photo-gallery"
import GalleryLigthbox from "../../components/Gallery/GalleryLigthbox/GalleryLigthbox"
import {deleteGallery, deleteGalleryImages, getGallery} from "../../data/gallery"
import LoadingGallery from "../../components/Gallery/LoadingGallery/LoadingGallery"
import {useTranslation} from "react-i18next"
import {useHistory} from "react-router-dom"
import {UserOutlined} from "@ant-design/icons"
import {mediaPath} from "../../util"
import {AvatarSizes, GallerySizes} from "../../constants/MediaSizes"
import {IconFA} from "../../components/Common/IconFA"
import SelectableImage from "../../components/Gallery/SelectableImage"
import GalleryAdder from "../../components/Gallery/GalleryAdder"
import {Image as ImageType} from "../../data/media/types"

export type SelectablePhoto = { selected: boolean }

/* We should create a GalleryService with them */
const getPhotosAsync = async (gallery: GalleryType): Promise<PhotoProps<SelectablePhoto>[]> => {
    return await Promise.all(
        gallery.images.map<PromiseLike<PhotoProps<SelectablePhoto>>>(img => parsePhoto(img.name, String(img.id)))
    )
}
const parsePhoto = (imgUrl: string, key: string): Promise<PhotoProps<SelectablePhoto>> => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = mediaPath(imgUrl, GallerySizes.THUMBNAIL)
        image.onerror = reject
        image.onload = () => resolve({
            selected: false,
            src: image.src,
            width: image.width,
            height: image.height,
            key
        })
    })
}

const Gallery: React.FC = () => {
    const {t} = useTranslation(["gallery", "common"])
    const history = useHistory()
    const {id, picture} = useParams()

    const [loading, setLoading] = useState<boolean>(true)
    const [editMode, setEditMode] = useState<boolean>(false)
    const [gallery, setGallery] = useState<GalleryType>()
    const [photos, setPhotos] = useState<PhotoProps<SelectablePhoto>[]>([])
    const [isOpeningLigthbox, setOpenLigthbox] = useState<boolean>(false)
    const [currentPhoto, setCurrentPhoto] = useState<PhotoProps<SelectablePhoto>>()


    /*Gallery initialization*/
    useEffect(() => {
        if (id) {
            getGallery(id).then(res => {
                if (res.data) {
                    setGallery(res.data)
                    getPhotosAsync(res.data)
                        .then((photos) => {
                            setPhotos(photos)
                            if (picture) {
                                setCurrentPhoto(photos[parseInt(picture)])
                                setOpenLigthbox(true)
                            }
                        })
                        .catch(e => {
                            message.error("Error while parsing...")
                            console.log(e)
                        })
                        .finally(() => setLoading(false))
                }
            }).catch(e => message.error(`Get this gallery failed ,${e}`))
        }
    }, [id, picture])

    const handleSelect = useCallback((key: string) => {
        setPhotos(prevState => prevState.map(photo => ((photo.key as string) === key) ?
            ({...photo, selected: !photo.selected}) : photo
        ))
    }, [])

    const addNewImages = useCallback((images: ImageType[]) => {
        Promise.all(images.map(img => parsePhoto(img.name, String(img.id)))).then(photos => {
            setPhotos(prevState => [...prevState, ...photos])
        }).catch(e => message.error("Error while parsing...", e))
    }, [])

    const removeSelection = useCallback(() => {
        if (gallery)
            Modal.confirm({
                title: t("common:remove_item.title"),
                content: t("common:remove_item.content"),
                okText: "Ok",
                cancelText: t("common:cancel"),
                onOk: async () => {
                    const ids: number[] = []
                    photos.forEach(p => {
                        if (p.selected)
                            ids.push(+(p.key as string))
                    })
                    if(ids.length === photos.length){
                        deleteGallery(gallery.id).then(() =>
                            message.info(t("common:remove_item.complete"))
                        )
                    }else {
                        deleteGalleryImages(gallery.id, ids)
                            .then(() => {
                                message.success(t("selection_delete"))
                                setPhotos(prevPhotos => prevPhotos.filter(p => !p.selected))
                            })
                            .catch(e => {
                                message.error(t("Une erreur est survenue"))
                                console.log(e)
                            })
                    }
                }
            })
    }, [gallery, photos])

    const imageRenderer = useCallback(({index, key, left, top, photo}: any) => (
        <SelectableImage
            key={key}
            selectable={editMode}
            margin={"2px"}
            index={index}
            photo={photo}
            left={left}
            top={top}
            direction="row"
            onSelect={handleSelect}
            onClick={openLightbox}
        />
    ), [editMode])

    const onCurrentPhotoChange = useCallback((photo) => {
        setPhotos(photos)
        history.push(`/gallery/${id}/picture/${photo.key}`)
    }, [id, photos])

    const closeLightbox = useCallback(() => {
        setOpenLigthbox(false)
        history.push(`/gallery/${id}`)
    }, [id])

    const openLightbox: renderImageClickHandler = useCallback((e, photo) => {
        if (photo) {
            setCurrentPhoto(photo as PhotoProps<SelectablePhoto>)
            setOpenLigthbox(true)
            history.push(`/gallery/${id}/picture/${photo.index}`)
        }
    }, [id])

    const removeGallery = useCallback(() =>
        Modal.confirm({
            title: t("common:remove_item.title"),
            content: t("common:remove_item.content"),
            okText: "Ok",
            cancelText: t("common:cancel"),
            onOk: async () => {
                const res = await deleteGallery(gallery!.id)
                if (res.status === 200) {
                    message.info(t("common:remove_item.complete"))
                    history.push("/")
                }
            }
        }), [gallery])

    return (
        <div className="w-5/6 mx-auto flex flex-col m-6 mb-20">
            <div className="flex justify-between m-2">
                <div>
                    {loading && !gallery ?
                        <Skeleton loading={true} active paragraph={false} className="w-48 mr-2"/> :
                        <>
                            <div className="font-bold text-xl text-blue-900 ">{gallery?.name}</div>
                            <span className="ml-2 text-xs">{`${gallery?.images.length} ${t("pictures")}`}</span>
                        </>
                    }
                </div>
                {gallery?.hasRight && editMode ?
                    <div className="flex flex-col items-end">
                        <Button type="primary" className="rounded mx-1" style={{width: "max-content"}} onClick={() => setEditMode(false)}>
                            {t("common:back")}
                            <IconFA name="fa-sign-out-alt" className="ml-2"/>
                        </Button>
                        <div className="flex mt-3">
                            <GalleryAdder gallery={gallery.id} afterUpload={addNewImages}/>
                            <Button className="rounded mx-1" danger onClick={removeSelection}>
                                {t("delete_selection")}
                                <IconFA name="fa-trash-alt" className="ml-2" type="regular"/>
                            </Button>

                        </div>
                    </div> :
                    <div className="flex ">
                        <Button type="primary" className="rounded mx-1" onClick={() => setEditMode(true)}>
                            {t("common:edit")}
                            <IconFA name="fa-edit" className="ml-2" type="regular"/>
                        </Button>
                        <Button type="primary" className="rounded mx-1" danger onClick={removeGallery}>
                            {t("common:delete")}
                            <IconFA name="fa-trash-alt" className="ml-2" type="regular"/>
                        </Button>
                    </div>
                }
            </div>
            <div className="p-1">
                {loading ?
                    <LoadingGallery/> :
                    <PhotoGallery photos={photos} direction="row" renderImage={imageRenderer}/>
                }
            </div>
            {loading ?
                <div className="flex flex-row items-center w-fit-content mt-2 h-16 mb-8 ml-auto">
                    <Skeleton loading={loading} active paragraph={false} className="mr-2 w-48"/>
                    <Skeleton avatar={true} loading={loading} active paragraph={false} title={false}/>
                </div> :
                <div className="h-16 mt-2 mb-4 w-full text-right mr-2">
                    {`${t("posted_date")} ${gallery && new Date(gallery.creation).toLocaleDateString()} ${t("by")}`}
                    <Tooltip title={gallery?.club.name}>
                        <Link to={"/club/1"}>
                            <Avatar
                                src={gallery?.club.logoUrl && mediaPath(gallery?.club.logoUrl, AvatarSizes.THUMBNAIL)}
                                shape="circle"
                                className="w-12 h-12 ml-2 leading-tight hover:opacity-75 hover:shadow-outline cursor-pointer"
                                icon={<UserOutlined/>}
                                size="large"
                            />
                        </Link>
                    </Tooltip>
                </div>
            }
            {isOpeningLigthbox &&
            <GalleryLigthbox
                photos={photos}
                onCurrentPhotoChange={onCurrentPhotoChange}
                onClose={closeLightbox}
                currentPhoto={currentPhoto}
            />
            }
        </div>
    )
}

export default Gallery