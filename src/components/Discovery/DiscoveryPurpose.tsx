import React from "react"

type DiscoveryPurposeProps = {
    title: string
    description: string
    img: string
}
const DiscoverPurpose: React.FC<DiscoveryPurposeProps> = ({title, img, description}) => (
    <div className="text-center sm:w-1/3 w-4/5 px-1" style={{minHeight: "16rem"}}>
        <img src={img} className="h-40 mx-auto" alt={title}/>
        <h4 className="font-bold text-indigo-500 ">{title}</h4>
        <p className="max-w-md">
            {description}
        </p>
    </div>
)

export default DiscoverPurpose