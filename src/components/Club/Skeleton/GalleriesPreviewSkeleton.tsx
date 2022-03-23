import {Skeleton} from "antd"
import React from "react"

const GalleriesPreviewSkeleton: React.FC = () => (
    <>
        <Skeleton.Input className="w-full rounded my-1 mt-3" active size="large"/>
        <Skeleton.Input className="w-full rounded my-1" active size="large"/>
        <Skeleton.Input className="w-full rounded my-1" active size="large"/>
    </>
)

export default GalleriesPreviewSkeleton