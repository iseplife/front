import React from "react"
import ClubHeaderSkeleton from "./ClubHeaderSkeleton"
import ClubHomepageSkeleton from "./ClubHomepageSkeleton"


const ClubSkeleton: React.FC = () => (
    <div className="w-full h-full ">
        <ClubHeaderSkeleton />
        <ClubHomepageSkeleton />
    </div>
)
export default ClubSkeleton