import React from "react";

type ClubFollowSkeletonProps = {
  count?: number
}

const ClubFollowSkeleton: React.FC<ClubFollowSkeletonProps> = ({count = 1}) => {
  return (
      <>
        { new Array(count).fill(
        <>
          <div className="flex animate-pulse">
            <div className="rounded-full h-14 w-14 sm:w-16 sm:h-16 bg-neutral-300 flex-shrink-0"/>
            <div className="w-full">
              <div className="flex justify-between">
                <div className="ml-2 sm:ml-4">
                  <div className="sm:mb-1 h-4 bg-neutral-300 w-20 sm:w-32"/>
                  <div className="sm:w-72 lg:w-96 hidden sm:block bg-neutral-300 h-4"/>
                  <div className="sm:w-72 lg:w-96 hidden sm:block bg-neutral-300 h-4 mt-1 origin-left scale-x-75"/>
                  <div className="sm:w-72 lg:w-96 hidden sm:block bg-neutral-300 h-4 mt-1 origin-left scale-x-[85%]"/>
                </div>
                <div className="mb-1.5 sm:mb-0 sm:h-16 flex sm:items-center ml-8">
                  <div className="w-[80px] sm:w-[150px] bg-indigo-400 rounded-full h-10 mr-2 flex-shrink-0" />
                </div>
              </div>
              <div className="ml-2 text-sm text-black/[65%] font-normal leading-4 sm:hidden mr-2">
                <div className="bg-neutral-300 h-4 w-full"/>
                <div className="bg-neutral-300 h-4 mt-1 origin-left scale-x-75 w-full"/>
                <div className="bg-neutral-300 h-4 mt-1 origin-left scale-x-[85%] w-full"/>
              </div>
            </div>
          </div>
          <div className="h-0.5 bg-black/5 w-full my-4 rounded-full" />
        </>
        )}
      </>
  )
}

export default ClubFollowSkeleton