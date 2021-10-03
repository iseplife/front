import React, {useMemo} from "react"
import {Skeleton} from "antd"

interface ClubMemberSkeletonProps {
    loading: boolean
    amount: number
}

const ClubMemberSkeleton: React.FC<ClubMemberSkeletonProps> = ({loading, amount}) => {
    const renderLoop = useMemo(() => {
        const cardTextSkeletonArray = []
        for (let i = 0; i < amount; i++) {
            cardTextSkeletonArray.push(
                <div key={i} className="h-20 w-full sm:h-60 sm:w-44 p-2 sm:p-3 pb-2 m-2 shadow-md flex sm:flex-col flex-row items-center bg-white rounded-lg">
                    <Skeleton.Image className="sm:w-full h-full w-1/3 rounded-lg" />
                    <Skeleton
                        className="mt-0 ml-2 sm:mt-2 sm:ml-0 w-2/3 sm:w-full"
                        loading={loading}
                        active
                        title={false}
                        paragraph={{ rows: 2 }}
                    />
                </div>
            )
        }

        return cardTextSkeletonArray
    }, [amount, loading])

    return (
        <>
            {renderLoop}
        </>
    )
}

export default ClubMemberSkeleton
