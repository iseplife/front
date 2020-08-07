import React from "react"

type DiscoveryPurposeProps = {
    title: string
    description: string
    img: string
}
const DiscoverPurpose: React.FC<DiscoveryPurposeProps> = ({title, img, description}) => {

    return (
        <div className="h-64 text-center">
            <img src={img} className="h-40"/>
            <h4 className="font-bold text-indigo-500 ">{title}</h4>
            <p>
                {description}
            </p>
        </div>
    )
};

export default DiscoverPurpose