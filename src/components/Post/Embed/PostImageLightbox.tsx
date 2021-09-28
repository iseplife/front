import React, { useEffect, useMemo, useState } from "react"
import Post from ".."
import { Post as PostData } from "../../../data/post/types"
import { PostPhoto, _formatDistance } from "../../../util"
import SafeImage from "../../Common/SafeImage"

type LightboxProps = {
    post: PostData,
    photos: PostPhoto[]
    currentPhotoIndex: number
    closeCallback: () => void,
    setCurrentPhotoIndex: (index: number) => void,
}
const PostImageLightbox: React.FC<LightboxProps> = ({ post, photos, currentPhotoIndex, closeCallback, setCurrentPhotoIndex }) => {
    const currentPhoto = useMemo(() => photos[currentPhotoIndex], [currentPhotoIndex, photos])
    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)

    let rightPanel: HTMLDivElement

    useEffect(() => {
        const handleResize = () => {
            const ratio = currentPhoto.width / currentPhoto.height

            let { width: rpWidth, height: lbHeight } = rightPanel.getBoundingClientRect()!
            lbHeight = lbHeight || window.innerHeight
            rpWidth = rpWidth ?? 0

            const lbWidth = window.innerWidth - rpWidth
            
            const lbRatio = lbWidth / lbHeight
            
            if (ratio > lbRatio) {
                setWidth(lbWidth)
                setHeight(lbWidth / ratio)
            } else {
                setWidth(ratio * lbHeight)
                setHeight(lbHeight)
            }
        }
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [currentPhoto])
    
    return (
        <div>
            <div className="flex bg-black bg-opacity-80 fixed top-0 left-0 w-screen h-screen z-50 backdrop-blur-md backdrop-filter max-w-full">
                <div className="w-full grid place-items-center relative">
                    <div className="w-full h-full absolute top-0 left-0" onClick={closeCallback}></div>
                    <div className="absolute p-3 m-3.5 bg-gray-800 bg-opacity-60 hover:bg-gray-700 hover:bg-opacity-50 transition-colors rounded-full cursor-pointer z-50 top-0 left-0"
                        onClick={closeCallback}>
                        <img src="/img/icons/close.svg" className="w-3.5 h-3.5" />
                    </div>
                    <div className="relative m-auto">
                        <SafeImage
                            key={currentPhotoIndex}
                            nsfw={currentPhoto.nsfw}
                            src={currentPhoto.hdSrc}
                            alt={currentPhoto.alt}
                            width={width}
                            height={height}
                            clickable={false}
                        />
                    </div>
                    {currentPhotoIndex + 1 < photos.length &&
                        <div className="absolute right-0 p-2.5 m-3 bg-gray-800 bg-opacity-60 hover:bg-gray-700 hover:bg-opacity-50 transition-colors rounded-full cursor-pointer z-50"
                            onClick={() => setCurrentPhotoIndex(currentPhotoIndex + 1)}>
                            <img src="/img/icons/left-arrow.svg" className="text-white w-4 h-4 transform rotate-180" />
                        </div>
                    }
                    {currentPhotoIndex > 0 &&
                        <div className="absolute left-0 p-2.5 m-3 bg-gray-800 bg-opacity-60 hover:bg-gray-700 hover:bg-opacity-50 transition-colors rounded-full cursor-pointer z-50"
                            onClick={() => setCurrentPhotoIndex(currentPhotoIndex - 1)}>
                            <img src="/img/icons/left-arrow.svg" className="text-white w-4 h-4" />
                        </div>
                    }
                </div>
                
                <div className="bg-gray-100 flex-shrink-0 w-96 rounded-tl-md rounded-bl-md overflow-auto hidden md:block" ref={element => rightPanel = element ?? rightPanel}>
                    <Post data={post} isEdited={false} embeded={true} forceShowComments={true}></Post>
                </div>
            </div>
        </div>
    )
}

export default PostImageLightbox