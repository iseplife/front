import {Link} from "react-router-dom"
import React from "react"
import {ClubPreview} from "../../data/club/types"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"

type ClubCardProps = {
    club: ClubPreview
}

const ClubCard: React.FC<ClubCardProps> = ({club}) => (
    <div className="my-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6">
        <Link to={`/club/${club.id}`}>
            <div
                className="mx-1 bg-white rounded-2xl overflow-hidden hover:shadow-sm transition-shadow h-52 px-5 items-end flex aspect-[18/20]"
                style={{
                    backgroundImage: `url("${mediaPath(club.logoUrl, AvatarSizes.FULL)}")`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "147%",
                    backgroundPosition: "center",
                }}
            >
                <div className="h-12 bg-white/40 rounded-xl backdrop-blur grid place-items-center px-3 py-2 mb-3 mt-auto w-full text-neutral-800 font-semibold text-2xl">
                    {club.name}
                </div>
            </div>
        </Link>
    </div>
)

export default ClubCard