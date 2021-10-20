import React from "react"
import ClubPresentationSkeleton from "./ClubPresentationSkeleton"
import FeedSkeleton from "../../Feed/FeedSkeleton"

const ClubHomepageSkeleton: React.FC = () => (
    <div key="desktop-display" className="flex flex-row -mt-10 pt-10 px-5">
        <div className="w-full flex flex-row flex-wrap">
            <ClubPresentationSkeleton />
            <div className="flex-grow">
                <FeedSkeleton />
            </div>
        </div>
    </div>
)
export default ClubHomepageSkeleton