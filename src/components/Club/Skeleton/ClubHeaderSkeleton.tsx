import React from "react"
import {Avatar, Skeleton} from "antd"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons"

const ClubHeaderSkeleton: React.FC = () => (
    <>
        <div className="w-full md:h-40 h-24 relative">
            <div
                className="w-full h-full bg-gray-300"
            />
        </div>
        <div className="flex justify-between container p-3 mx-auto">
            <Avatar
                icon={<FontAwesomeIcon icon={faCircleNotch} spin size="3x" className="text-white h-full"/>}
                shape="circle"
                className="-mt-8 w-20 h-20 md:w-32 md:h-32 shadow-md bg-gray-200"
            />
            <div className="flex">
                <Skeleton className="w-64" active title paragraph={false}/>
                <Skeleton className="w-32" active title paragraph={false}/>
            </div>
            <div className="flex flex-wrap items-center" style={{height: "min-content"}}>

            </div>
        </div>
    </>
)
export default ClubHeaderSkeleton