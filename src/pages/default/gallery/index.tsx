import React, {useCallback, useEffect, useMemo, useState} from "react"
import {Link, useParams} from "react-router-dom"
import {Gallery as GalleryType} from "../../../data/gallery/types"
import {Avatar, Button, message, Modal, Skeleton, Tooltip} from "antd"
import PhotoGallery, {PhotoProps, renderImageClickHandler} from "react-photo-gallery"
import GalleryLigthbox from "../../../components/Gallery/GalleryLigthbox/GalleryLigthbox"
import {deleteGallery, deleteGalleryImages, getGallery} from "../../../data/gallery"
import LoadingGallery from "../../../components/Gallery/LoadingGallery/LoadingGallery"
import {useTranslation} from "react-i18next"
import {useHistory} from "react-router-dom"
import {UserOutlined} from "@ant-design/icons"
import {AvatarSizes, GallerySizes} from "../../../constants/MediaSizes"
import {IconFA} from "../../../components/Common/IconFA"
import SelectableImage from "../../../components/Gallery/SelectableImage"
import GalleryAdder from "../../../components/Gallery/GalleryAdder"
import {Image as ImageType} from "../../../data/media/types"
import {mediaPath} from "../../../util"

export type SelectablePhoto = { selected: boolean, nsfw: boolean }

/* We should create a GalleryService with them */
const getPhotosAsync = async (gallery: GalleryType): Promise<PhotoProps<SelectablePhoto>[]> => {
    return await Promise.all(
        gallery.images.map<PromiseLike<PhotoProps<SelectablePhoto>>>(img => parsePhoto(img.name, String(img.id), img.nsfw))
    )
}
const parsePhoto = (imgUrl: string, key: string, nsfw: boolean): Promise<PhotoProps<SelectablePhoto>> => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = mediaPath(imgUrl, GallerySizes.PREVIEW) as string
        image.onerror = reject
        image.onload = () => resolve({
            nsfw,
            selected: false,
            src: image.src,
            width: image.width,
            height: image.height,
            key
        })
    })
}

interface ParamTypes {
    id?: string
}

const Gallery: React.FC = () => {
    const {t} = useTranslation(["gallery", "common"])
    const history = useHistory()
    const {id} = useParams<ParamTypes>()
    const picture = useMemo(() => new URLSearchParams(window.location.search).get("p"), [window.location.search])

    const [loading, setLoading] = useState<boolean>(true)
    const [editMode, setEditMode] = useState<boolean>(false)
    const [gallery, setGallery] = useState<GalleryType>()
    const [photos, setPhotos] = useState<PhotoProps<SelectablePhoto>[]>([])
    const [isOpeningLigthbox, setOpenLigthbox] = useState<boolean>(false)
    const [currentPhoto, setCurrentPhoto] = useState<ImageType>()

    /**
     * Get Gallery and parse photos on first load
     */
    useEffect(() => {
        if (id) {
            getGallery(id).then(res => {
                if (res.data) {
                    setGallery(res.data)
                    getPhotosAsync(res.data)
                        .then(photos => {
                            setPhotos(photos)
                            if (picture) {
                                setCurrentPhoto(res.data.images.find(img => img.id === parseInt(picture)))
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
        Promise.all(images.map(img => parsePhoto(img.name, String(img.id), img.nsfw))).then(photos => {
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
                    if (ids.length === photos.length) {
                        deleteGallery(gallery.id).then(() =>
                            message.info(t("common:remove_item.complete"))
                        )
                    } else {
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

    const openLightbox: renderImageClickHandler = useCallback((e, photo) => {
        if (photo && gallery) {
            setCurrentPhoto(gallery.images.find(img => img.id === photo.index))
            setOpenLigthbox(true)
            history.push(`/gallery/${id}?p=${photo.index}`)
        }
    }, [id, gallery])

    const exitEditMode = useCallback(() => {
        setEditMode(false)
        setPhotos(prevState => prevState.map(photo => ({...photo, selected: false}) ))
    }, [])

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
    ), [editMode, handleSelect, openLightbox])

    const onCurrentPhotoChange = useCallback((photo: ImageType) => {
        setCurrentPhoto(photo)
        history.push(`/gallery/${id}?p=${photo.id}`)
    }, [id, photos])

    const closeLightbox = useCallback(() => {
        setOpenLigthbox(false)
        history.push(`/gallery/${id}`)
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
            <div className="flex flex-col sm:flex-row justify-between m-2">
                <div>
                    {loading && !gallery ?
                        <Skeleton loading={true} active paragraph={false} className="w-48 mr-2"/> :
                        <>
                            <div className="font-bold text-4xl text-gray-700">{gallery?.name}</div>
                            <span className="text-xs text-gray-600">{`${gallery?.images.length} ${t("pictures")}`}</span>
                        </>
                    }
                </div>
                <div>
                    {loading ?
                        <div className="flex flex-row items-center w-fit-content mt-2 h-16 mb-8 ml-auto">
                            <Skeleton loading={loading} active paragraph={false} className="mr-2 w-48"/>
                            <Skeleton avatar={true} loading={loading} active paragraph={false} title={false}/>
                        </div> :
                        <div className="mb-2 w-full text-right mr-2">
                            <span className="text-xs text-gray-600">
                                {`${t("posted_date")} ${gallery && new Date(gallery.creation).toLocaleDateString()} ${t("by")}`}
                            </span>
                            <Tooltip title={gallery?.club.name}>
                                <Link to={"/club/1"}>
                                    <Avatar
                                        src={mediaPath(gallery?.club.logoUrl, AvatarSizes.THUMBNAIL)}
                                        shape="circle"
                                        className=" ml-2 leading-tight hover:opacity-75 hover:shadow-outline cursor-pointer"
                                        icon={<UserOutlined/>}
                                    />
                                </Link>
                            </Tooltip>
                        </div>
                    }
                    {gallery?.hasRight && editMode ?
                        <div className="flex flex-col items-end">
                            <Button type="primary" className="shadow-md rounded mx-1" style={{width: "max-content"}} onClick={exitEditMode}>
                                {t("common:back")}
                                <IconFA name="fa-sign-out-alt" className="ml-2"/>
                            </Button>
                            <div className="flex mt-3">
                                <GalleryAdder club={gallery.club.id} gallery={gallery.id} afterUpload={addNewImages}/>
                                <Button className="rounded mx-1" danger onClick={removeSelection}>
                                    {t("delete_selection")}
                                    <IconFA name="fa-trash-alt" className="ml-2" type="regular"/>
                                </Button>
                            </div>
                        </div> :
                        <div className="flex justify-end">
                            <Button type="primary" className="shadow-md rounded mx-1" onClick={() => setEditMode(true)}>
                                {t("common:edit")}
                                <IconFA name="fa-edit" className="ml-2" type="regular"/>
                            </Button>
                            <Button type="primary" className="shadow-md rounded mx-1" danger onClick={removeGallery}>
                                {t("common:delete")}
                                <IconFA name="fa-trash-alt" className="ml-2" type="regular"/>
                            </Button>
                        </div>
                    }
                </div>
            </div>
            <div className="p-1">
                {loading ?
                    <LoadingGallery/> :
                    <PhotoGallery
                        renderImage={imageRenderer}
                        targetRowHeight={200}
                        photos={photos}
                        direction="row"
                    />
                }
            </div>
            {isOpeningLigthbox && (
                <GalleryLigthbox
                    photos={gallery?.images || []}
                    current={currentPhoto}
                    onCurrentPhotoChange={onCurrentPhotoChange}
                    onClose={closeLightbox}
                />
            )}
        </div>
    )
}

export default Gallery
