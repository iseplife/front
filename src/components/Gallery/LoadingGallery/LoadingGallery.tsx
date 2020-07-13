import React, {useMemo} from "react"
import {AvatarProps} from "antd/es/avatar"
import {Skeleton} from "antd"

const SKELETON_PLACEHOLDER_COUNT = 10

const LoadingGallery: React.FC = () => {
    const LoadingGalleryElements = useMemo(() => {
        const galleryLoading = []
        for(let i = 0; i< SKELETON_PLACEHOLDER_COUNT; i++) {
            galleryLoading.push(
                <Skeleton
                    key={i}
                    active
                    className="w-auto h-auto pb-4 mx-auto"
                    loading={true}
                    avatar={{shape: "square", className: "w-48 h-48"}}
                    paragraph={false}
                    title={false}
                />
            )
        }
        return galleryLoading
    }, [])

    return (
        <div className="flex flex-row flex-wrap w-full p-4">
            {LoadingGalleryElements}
        </div>
    )
}

export default LoadingGallery