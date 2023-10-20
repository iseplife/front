import React, {useMemo} from "react"

interface ClubMemberSkeletonProps {
    amount: number
}

const ClubMemberSkeleton: React.FC<ClubMemberSkeletonProps> = ({amount}) => {
    const renderLoop = useMemo(() => {
        const cardTextSkeletonArray = []
        for (let i = 0; i < amount; i++) {
            cardTextSkeletonArray.push(
                <div key={i} className="w-1/2 xl:w-1/3 p-2">
                    <div className="bg-white block w-full rounded-lg shadow-sm">
                        <div className="w-full aspect-[18/20] rounded-t-lg bg-gray-300 animate-pulse">

                        </div>
                        <div className="h-14 flex items-center justify-center">
                            <div className="bg-gray-300 h-6 animate-pulse rounded-full w-2/3"></div>
                        </div>
                    </div>                  
                </div>
            )
        }

        return cardTextSkeletonArray
    }, [amount])

    return (
        <>
            {renderLoop}
        </>
    )
}

export default ClubMemberSkeleton
