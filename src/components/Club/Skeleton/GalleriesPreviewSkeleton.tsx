import {Skeleton} from "antd"
import React from "react"

const GalleriesPreviewSkeleton: React.FC = () => (
    <>
        <div className="w-full rounded h-32 lg:h-28 my-1 mt-3 bg-neutral-200 animate-pulse"></div>
        <div className="w-full rounded h-32 lg:h-28 my-1 bg-neutral-200 animate-pulse"></div>
        <div className="w-full rounded h-32 lg:h-28 my-1 bg-neutral-200 animate-pulse"></div>
    </>
)

export default GalleriesPreviewSkeleton