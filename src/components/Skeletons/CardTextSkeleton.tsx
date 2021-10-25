import React, {useMemo} from "react"
import {Card, Skeleton} from "antd"

interface CardTextSkeletonProps {
    loading: boolean
    number: number
    className: string
}

const CardTextSkeleton: React.FC<CardTextSkeletonProps> = ({loading, number, className}) => {
    const renderLoop = useMemo(() => {
        const cardTextSkeletonArray = []
        for (let i = 0; i < number; i++) {
            cardTextSkeletonArray.push(
                <Card key={i} className={`${className} shadow-sm rounded-lg bg-white `}>
                    <Skeleton
                        loading={loading}
                        avatar
                        active
                        paragraph={true}
                        title={false}/>
                </Card>
            )
        }

        return cardTextSkeletonArray
    }, [number])

    return (
        <div className="flex flex-col">
            {renderLoop}
        </div>
    )
}

export default CardTextSkeleton
