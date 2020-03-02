import React from "react";
import {AvatarProps} from "antd/es/avatar";
import {Skeleton} from "antd";

const LoadingGallery: React.FC = () => {

    const LoadingGalleryElement = () => {
        const avatarProps: AvatarProps = { shape: "square", className: "w-48 h-48"};

        let galleryLoading = [];
        for(let i=0; i< 10; i++) {
            galleryLoading.push(
                <Skeleton className="w-auto h-auto pb-4 mx-auto" loading={true} active avatar={avatarProps} paragraph={false} title={false}/>
            )
        }
        return galleryLoading;
    };

    return (
        <div className="flex flex-row flex-wrap w-full p-4">
            {LoadingGalleryElement()}
        </div>
    );
}

export default LoadingGallery;