import React from "react"
import CardTextSkeleton from "../Skeletons/CardTextSkeleton"

const FeedSkeleton: React.FC = () => (
    <div className="m-4 my-0 hidden md:block">
        <CardTextSkeleton loading={true} number={3} className="my-3" />
    </div>
)

export default FeedSkeleton