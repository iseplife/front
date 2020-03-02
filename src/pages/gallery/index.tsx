import React, {useCallback, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Gallery as GalleryType, Media as IsepLifeImage} from "../../data/gallery/type";
import {Avatar, Skeleton, Tooltip} from "antd";
import Gallery, {PhotoProps} from "react-photo-gallery";
import GalleryLigthbox from "../../components/Gallery/GalleryLigthbox/GalleryLigthbox";
import {getGalleryById} from "../../data/gallery";
import {ApiResponse} from "../../data/common/api";
import LoadingGallery from "../../components/Gallery/LoadingGallery/LoadingGallery";

const CustomGallery: React.FC = () => {
    // Gallery props
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [gallery, setGallery] = useState<GalleryType>();
    const [photos, setPhotos] = useState<PhotoProps[]>([]);

    // Lightbox props
    const [isOpeningLigthbox, setOpenLigthbox] = useState<boolean>(false);
    const [currentPhoto, setCurrentPhoto] = useState<PhotoProps>();

    // First, load gallery with id contains on url
    useEffect(() => {
        if (!!id) { initGallery(parseInt(id));
        }
    }, []);
    const initGallery = (id: number) => {
        getGalleryById(id)
            .then((res: ApiResponse<GalleryType>) => {
                const galleryResponse = res.data;
                if (!!galleryResponse) {
                    setGallery(galleryResponse);
                    getPhotosAsync(galleryResponse).then((photos: PhotoProps[]) => setPhotos(photos));
                }
            })
            .catch(e => console.log(e, "ERREUR"))
            .finally(() => {
                setIsLoading(false);
            });
    };

    // Secund, transform images in photos with the same properties in the react-image-gallery's library.
    const getPhotosAsync = async (gallery: GalleryType): Promise<PhotoProps[]> => {
        let uniqueKey = 0;
        return await Promise.all(gallery.previewImages.map<PromiseLike<PhotoProps>>((img: IsepLifeImage) =>
            parsePhoto(img.name, `${img.name}-${uniqueKey++}`)
        ));
    };
    const parsePhoto = (imgUrl: string, imgIndex: string): Promise<PhotoProps> => {
        return new Promise((resolve, reject) => {
            let image = new Image();
            image.src = imgUrl;
            image.onload = () => resolve({
                src: imgUrl,
                width: image.width,
                height: image.height,
                key: imgIndex
            });
        });
    };

    // Third, lightbox's functions
    const onCurrentPhotoChange = (photo: PhotoProps) => setCurrentPhoto(photo);

    const closeLightbox = () => setOpenLigthbox(false);

    const openLightbox = useCallback((event, { photo, index }) => {
        if (!!photo) {
            setCurrentPhoto(photo);
            setOpenLigthbox(true);
        }
    }, []);

    return (
        <div className="w-5/6 mx-auto flex flex-col m-6 mb-6">
            <div className="flex flex-row">
                <Skeleton loading={isLoading} active paragraph={false} className="w-48 mr-2"/>
                <div className="font-bold text-xl text-blue-900 mt-2">{!!gallery ? gallery.name : ""}</div>
            </div>
            <div className="text-xs mt-2 mb-1 flex flex-row items-center">
                {!!gallery ? `${gallery.previewImages.length} files` : ""}
                <Skeleton loading={isLoading} active paragraph={false} className="w-20 mr-2"/>
            </div>
            <div className="flex flex-row bg-white p-1">
                {
                    !isLoading
                        ? <Gallery photos={photos} onClick={openLightbox} targetRowHeight={200} direction="row"/>
                        : <LoadingGallery/>
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
                            {`Posted the ${!!gallery ? new Date(gallery.creation).toLocaleDateString() : ""} by `}
                            <Tooltip title={!!gallery ? gallery.club.name : ""}>
                                <Link to={"/club/1"}>
                                    <Avatar shape="circle" className="w-12 h-12 ml-2 leading-tight hover:opacity-75 hover:shadow-outline cursor-pointer" icon="user" size="large"/>
                                </Link>
                            </Tooltip>
                        </div>
                    )
            }
            {
                isOpeningLigthbox
                    ?  <GalleryLigthbox photos={photos}
                                        onCurrentPhotoChange={onCurrentPhotoChange}
                                        onClose={closeLightbox}
                                        currentPhoto={currentPhoto}/>
                    : ""
            }
        </div>
    );
};

export default CustomGallery;