import React from "react"
import { AvatarSizes } from "../../constants/MediaSizes"
import { mediaPath } from "../../util"

type StudentCardProps = {
    id: number
    fullname: string
    picture?: string
    promo: number
    className?: boolean | string
}

const StudentCard: React.FC<StudentCardProps> = React.memo(({id, fullname, picture, promo, className}) => (
    <div
        className={"relative bg-white rounded-2xl overflow-hidden hover:shadow-sm transition-shadow h-52 px-3.5 items-end flex aspect-[18/20] " + className}
        style={{
            backgroundImage: `url("${picture ? mediaPath(picture, AvatarSizes.DEFAULT) : "img/icons/discovery/user.svg"}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "112%",
            backgroundPosition: "center",
        }}
    >
        <div className="absolute right-2.5 top-2.5 bg-white/30 rounded-lg grid place-items-center px-2 py-0.5 text-neutral-600 font-normal text-lg">
            {promo}
        </div>
        <div className="bg-white/40 rounded-xl backdrop-blur grid place-items-center px-2 py-2 leading-6 mb-3 mt-auto w-full text-neutral-800 font-semibold text-lg">
            <div className="line-clamp-2 text-ellipsis" title={fullname}>
                {fullname}
            </div>
        </div>
    </div>
))
StudentCard.displayName = "StudentCard"

export default StudentCard