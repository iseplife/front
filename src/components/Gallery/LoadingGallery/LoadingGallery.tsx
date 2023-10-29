import React, {useMemo} from "react"

const SKELETON_PLACEHOLDER_COUNT = 10

const LoadingGallery: React.FC = () => {
    const LoadingGalleryElements = useMemo(() => {
        const galleryLoading = []
        for(let i = 0; i< SKELETON_PLACEHOLDER_COUNT; i++) {
            galleryLoading.push(
                <div className="p-1 m-0 w-full sm:w-1/2 xl:w-1/3 2xl:w-1/5 aspect-[16/9]"><div className="bg-gray-300 animate-pulse w-full h-full"></div></div>
            )
        }
        return galleryLoading
    }, [])

    return (
        <div className="flex flex-row flex-wrap w-full">
            {LoadingGalleryElements}
        </div>
    )
}

export default LoadingGallery