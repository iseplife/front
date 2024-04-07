import React from "react"

type DiscoveryPurposeProps = {
    description: string
    img: string
}
const DiscoverPurpose: React.FC<DiscoveryPurposeProps> = ({img, description}) => (
    <div className="md:mt-0 border-black/[6%] border-[1.5px] rounded-xl relative pt-14 pb-4 px-[12%]">
        <div className="bg-indigo-400 rounded-full w-20 h-20 grid place-items-center absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 select-none">
            <img draggable="false" src={`img/icons/discovery/${img}.svg`} className="w-8 h-8" />
        </div>
        { description }
    </div>
)

export default DiscoverPurpose