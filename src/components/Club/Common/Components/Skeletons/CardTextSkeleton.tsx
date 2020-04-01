import React from "react";
import {Card, Skeleton} from "antd";

interface CardTextSkeletonProps {
    loading: boolean;
    number: number;
    className: string;
}

const CardTextSkeleton: React.FC<CardTextSkeletonProps> = ({loading, number, className}) => {
    const renderLoop = () => {
        let cardTextSkeletonArray = [];

        for (var i=0; i < number; i++) {
            cardTextSkeletonArray.push(
                <Card className={className} key={i}>
                    <Skeleton loading={loading} avatar active paragraph={true} title={false}></Skeleton>
                </Card>
            );
        }

        return cardTextSkeletonArray;
    };

    return (<div className="flex flex-row flex-wrap">{renderLoop()}</div>)
};

export default CardTextSkeleton;