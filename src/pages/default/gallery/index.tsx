import React, {RefObject, useCallback, useEffect, useMemo, useState} from "react"
import {Link, useParams} from "react-router-dom"
import {Gallery as GalleryType, GalleryUpdateForm} from "../../../data/gallery/types"
import {Button, Divider, message, Modal, Skeleton, Tooltip} from "antd"
import PhotoGallery, {PhotoProps, renderImageClickHandler} from "react-photo-gallery"
import {deleteGallery, deleteGalleryImages, getGallery, updateGallery} from "../../../data/gallery"
import LoadingGallery from "../../../components/Gallery/LoadingGallery/LoadingGallery"
import {useTranslation} from "react-i18next"
import {useHistory} from "react-router-dom"
import {AvatarSizes, GallerySizes} from "../../../constants/MediaSizes"
import SelectableImage from "../../../components/Gallery/SelectableImage"
import GalleryAdder from "../../../components/Gallery/GalleryAdder"
import {Image as ImageType, MediaStatus} from "../../../data/media/types"
import {parsePhotosAsync, mediaPath, SafePhoto, ParserFunction, formatDate, copyToClipboard, getGalleryLink} from "../../../util"
import {faSave, faShare, faSignOutAlt, faTimes, faTrash, faUserGroup} from "@fortawesome/free-solid-svg-icons"
import {faEdit, faTrashAlt} from "@fortawesome/free-regular-svg-icons"
import GallerySidebar from "./GallerySidebar"
import { AnimatedLightbox } from "../../../components/Common/AnimatedLightbox"
import { WebPAvatarPolyfill } from "../../../components/Common/WebPPolyfill"
import LinkEntityPreloader from "../../../components/Optimization/LinkEntityPreloader"
import {AxiosError} from "axios"
import { FormProvider, useForm } from "react-hook-form"
import AddEventTextField from "../event/add/textfield"
import Textarea from "react-expanding-textarea"
import Loading from "../../../components/Common/Loading"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import DropdownPanel from "../../../components/Common/DropdownPanel"
import DropdownPanelElement from "../../../components/Common/DropdownPanelElement"

export type GalleryPhoto = SafePhoto & {
    selected: boolean
    thread: number
}
const parserSelectablePhoto: ParserFunction<GalleryPhoto> = (img: ImageType, key: string) => {
    return {
        key,
        id: img.id,
        color: img.color,
        src: mediaPath(img.name, GallerySizes.PREVIEW) as string,
        ratio: img.ratio,
        selected: false,
        thread: img.thread,
        nsfw: img.nsfw,
        status: img.status,
        srcSet: img.name,
        width: img.ratio * 100,
        height: 100,
    }
}


interface ParamTypes {
    id?: string
}

const Gallery: React.FC = () => {
    const {id: idStr} = useParams<ParamTypes>()
    const id = useMemo(() => parseInt(idStr || ""), [idStr])

    const {t} = useTranslation(["gallery", "common"])
    const history = useHistory()
    const picture = useMemo<string | null>(() => new URLSearchParams(window.location.search).get("p"), [window.location.search])

    const [loading, setLoading] = useState<boolean>(true)
    const [editMode, setEditMode] = useState<boolean>(false)
    const [selectMode, setSelectMode] = useState<boolean>(false)
    const [gallery, setGallery] = useState<GalleryType>()
    const [photos, setPhotos] = useState<(GalleryPhoto & {ref: RefObject<HTMLDivElement>})[]>([])
    const [initialIndex, setInitialIndex] = useState<number>()

    const [updatingGallery, setUpdatingGallery] = useState(false)

    const methods = useForm({
        defaultValues: {
            name: gallery?.name,
            description: gallery?.description,
        }
    })

    const {register, formState, handleSubmit} = methods

    const handleSelect = useCallback((key: string) => {
        setPhotos(prevState => prevState.map(photo => (
            (photo.key as string) === key ?
                ({...photo, selected: !photo.selected}) :
                photo
        )))
    }, [])

    const addNewImages = useCallback((images: ImageType[]) => {
        Promise.all(images.map((img, i) => parserSelectablePhoto(img, String(i)))).then(photos => {
            setPhotos(prevState => [...prevState, ...photos].map(img => ({...img, ref: React.createRef()})))
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
                                console.error(e)
                            })
                    }
                }
            })
    }, [gallery, photos])

    useEffect(() => {
        const splitted = history.location.pathname.split("/")
        splitted.shift()
        if (splitted.length == 3)
            setInitialIndex(+splitted[2])
        else if (splitted.length != 2)
            history.replace("/404")
        else
            setInitialIndex(undefined)
    }, [history.location.pathname])
    const [openned, setOpenned] = useState(false)

    const openLightbox: renderImageClickHandler = useCallback((e, photo) => {
        if (photo && gallery) {
            history.push(`/gallery/${id}/${photo.index}`)
            setOpenned(true)
        }
    }, [id, gallery])

    const onLoaded = useCallback((photo: PhotoProps<GalleryPhoto>) => 
        setPhotos(photos => photos.map(old => old.id == photo.id ? {...old, status: MediaStatus.READY} : old))
    , [id, gallery])

    const exitSelectMode = useCallback(() => {
        setSelectMode(false)
        setPhotos(prevState => prevState.map(photo => ({...photo, selected: false})))
    }, [])

    const openEditMode = useCallback(() => {
        setEditMode(true)
        exitSelectMode()
    }, [exitSelectMode])

    const closeLightbox = useCallback(() => 
        setOpenned(openned => {
            if(!openned){
                const currentUrl = window.location.pathname
                window.history.replaceState(null, "", `/gallery/${id}`)
                window.history.pushState(null, "", currentUrl)
            }
            history.goBack()
            return false
        })
    , [id])

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

    const imageRenderer = useCallback(({ index, key, left, top, photo }: any) => (
        <SelectableImage
            photoRef={photo.ref}
            key={key}
            selectable={selectMode}
            margin={"2px"}
            index={index}
            photo={photo}
            left={left}
            top={top}
            direction="row"
            onSelect={handleSelect}
            onClick={openLightbox}
            onLoaded={onLoaded}
        />
    ), [handleSelect, onLoaded, openLightbox, selectMode])

    const sendGalleryUpdate = useCallback((values: any) => {

        if(updatingGallery || !formState.errors || !gallery){
            return
        }

        setUpdatingGallery(true)

        const formattedValues: GalleryUpdateForm = {
            name: values.name,
            description: values.description,
        }
        
        updateGallery(gallery.id, formattedValues).then(res => {
            if (res.status === 200)
                setGallery(res.data)
            setEditMode(false)
        }).finally(() => setUpdatingGallery(false))

    }, [formState.errors, gallery, updatingGallery])

    /**
     * Get Gallery and parse photos on first load
     */
    useEffect(() => {
        if (!isNaN(id)) {
            getGallery(id).then(res => {
                if (res.data) {
                    setGallery(res.data)
                    parsePhotosAsync(res.data.images, parserSelectablePhoto)
                        .then(photos => {
                            setPhotos(photos.map(photo => ({...photo, ref: React.createRef()})))
                            if (picture)
                                setInitialIndex(+picture)
                        })
                        .catch(e => {
                            message.error("Error while parsing...")
                            console.error(e)
                        })
                        .finally(() => setLoading(false))

                    methods.setValue("name", res.data.name)
                    methods.setValue("description", res.data.description)
                }
            }).catch((e: AxiosError) => {
                if (e.response && e.response.status == 404)
                    history.replace("/404")
            })
        } else {
            history.replace("/404")
        }
    }, [id])

    const updateURL = useCallback((index: number) => 
        window.history.replaceState(null, "", `/gallery/${id}/${index}`)
    , [id])

    const gallerySidebar = useCallback((gProps: any) => <GallerySidebar gallery={gallery} index={id} {...gProps} />, [gallery])

    const copyLink = useCallback(() => {
        if(gallery)
            copyToClipboard(getGalleryLink(gallery))
        message.success(t("post:copied"))
    }, [gallery, t])

    return (
        <div className="px-3 sm:px-0 sm:w-5/6 sm:mx-auto flex flex-col mt-2 mb-4">
            <div className="flex flex-col sm:flex-row justify-between m-2">
                <div>
                    {loading && !gallery ?
                        <div className="bg-gray-300 animate-pulse w-56 h-12"></div> :
                        <>
                            <h1 className="font-bold text-2xl sm:text-4xl text-neutral-800 mb-0">
                                {gallery?.name}
                                <span className="text-neutral-600 ml-3 text-xs sm:text-base font-semibold whitespace-nowrap">
                                    {`${gallery?.images.length} ${t("pictures")}`}
                                </span>
                            </h1>                          
                        </>
                    }
                </div>
            </div>
            <div className="px-1 sm:mt-1">
                <div className="w-full bg-white rounded-lg p-4 shadow-sm ">
                    { !editMode && 
                    <>
                        <div className="w-full flex justify-between mb-1">
                            <LinkEntityPreloader preview={gallery?.club} className="">
                                <Link to={`/club/${gallery?.club.id}`} className="inline-block">
                                    <div className="flex items-center text-black/[85%] group">
                                        <WebPAvatarPolyfill
                                            src={mediaPath(gallery?.club.logoUrl, AvatarSizes.THUMBNAIL)}
                                            shape="circle"
                                            className="leading-tight hover:shadow-outline cursor-pointer"
                                            icon={<div className="bg-gray-300 animate-pulse rounded-full aspect-square w-16"></div>}
                                        />
                                        <div className="items-center ml-2">
                                            <div className="font-bold -mb-0.5 -mt-0.5 group-hover:underline">{gallery?.club.name}</div>
                                            <div className="text-xs whitespace-nowrap">
                                                {gallery && formatDate(gallery.creation, t)[0].split(",")[0]}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                
                            </LinkEntityPreloader>
                            <div className="flex flex-row justify-end items-center text-lg -mt-4 -mr-1.5 min-w-0 ml-2">
                                <DropdownPanel
                                    panelClassName="w-32 right-0 lg:left-0 select-none text-base font-medium"
                                    closeOnClick={true}
                                    buttonClassName="mr-0 ml-1"
                                >
                                    <DropdownPanelElement
                                        title={t("post:copy_link")}
                                        onClick={copyLink}
                                        icon={faShare}
                                    />

                                    { gallery && gallery.hasRight && <DropdownPanelElement
                                        title={t("common:edit")}
                                        onClick={openEditMode}
                                        icon={faEdit}
                                    /> }

                                    { gallery && gallery.hasRight && <DropdownPanelElement
                                        title={t("common:delete")}
                                        onClick={removeGallery}
                                        icon={faTrashAlt}
                                        color="red"
                                    /> }
                                    
                                </DropdownPanel>
                            </div>
                        </div>

                        { loading &&
                            <div className="bg-gray-300 h-5 w-44 animate-pulse"></div>
                        }

                        { !loading &&
                            <p className="pt-2 mb-0 whitespace-pre">{gallery?.description}</p>
                        }
                    </>  
                    }
                    {editMode && <>
                        <form onSubmit={handleSubmit(sendGalleryUpdate)}>
                            <FormProvider {...methods}>
                                <div>
                                    <Divider className="text-gray-700 text-lg mb-1 mt-0" orientation="left">{t("edit_gallery")}</Divider>
                                </div>
                                <AddEventTextField title={t("gallery_name")} className="mt-4">
                                    <input {...register("name", {required: true, minLength: 3})} type="text" className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full" />
                                </AddEventTextField>

                                <AddEventTextField title={t("gallery_description")} className="mt-4">
                                    <Textarea {...register("description", {required: true, maxLength: 2000})} className="rounded-lg border border-neutral-200 p-3 pt-5 pb-2 w-full resize-none max-h-[50vh]" placeholder={t("gallery_description")} />
                                </AddEventTextField>
                                <div className="flex justify-between items-center mt-2">
                                    <button type="button" onClick={() => setEditMode(false)} className={"px-4 py-2 rounded-full bg-neutral-400 hover:bg-opacity-90 duration-100 shadow-sm text-center font-semibold text-white whitespace-nowrap flex flex-row items-center"}>{t("common:cancel")}</button>
                                    <button disabled={updatingGallery} className={"px-4 py-2 rounded-full bg-indigo-400 hover:bg-opacity-90 duration-100 shadow-sm text-center font-semibold text-white whitespace-nowrap flex flex-row items-center"}>{updatingGallery ? <Loading className="mr-2" /> : <FontAwesomeIcon icon={faSave} className="mr-2" /> } {t("save")}</button>
                                </div>
                            </FormProvider>
                        </form>
        
                    </>}
                </div>
            </div>    
            {gallery && !editMode && gallery.hasRight && <div className="flex space-x-2 mt-4 px-2 text-sm">

                { !selectMode && 
                    <GalleryAdder club={gallery.club.id} gallery={gallery.id} afterUpload={addNewImages}/>
                }
                { selectMode && 
                    <>
                        <button onClick={removeSelection} className={"px-4 py-2 rounded-full bg-red-400 hover:bg-opacity-90 duration-100 shadow-sm text-center font-semibold text-white whitespace-nowrap flex flex-row items-center"}><FontAwesomeIcon icon={faTrashAlt} className="mr-2" /> {t("delete_selection")}</button>
                        <button onClick={exitSelectMode} className={"px-4 py-2 rounded-full bg-gray-400 hover:bg-opacity-90 duration-100 shadow-sm text-center font-semibold text-white whitespace-nowrap flex flex-row items-center"}><FontAwesomeIcon icon={faTimes} className="mr-2" /> {t("common:cancel")}</button>
                    </>
                }

                { !selectMode && 
                    <button onClick={() => setSelectMode(true)} className={"px-4 py-2 rounded-full bg-red-400 hover:bg-opacity-90 duration-100 shadow-sm text-center font-semibold text-white whitespace-nowrap flex flex-row items-center"}><FontAwesomeIcon icon={faTrashAlt} className="mr-2" /> {t("enable_selection")}</button>
                }
            </div>}       
            <div className="p-1 mt-2">
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
            <AnimatedLightbox
                show={initialIndex != undefined && gallery != undefined}
                initialIndex={initialIndex as number}
                photos={photos}
                onChange={updateURL}
                onClose={closeLightbox}
                Sidebar={gallerySidebar}
                gallery={true}
            />
        </div>
    )
}

export default Gallery
