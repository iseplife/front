import {Link} from "react-router-dom"
import React from "react"
import {ClubPreview} from "../../data/club/types"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"

type ClubCardProps = {
    club: ClubPreview
}

const ClubCard: React.FC<ClubCardProps> = ({club}) => (
    <Link to={`/club/${club.id}`}>
        <div
            className="mx-1 bg-white rounded-2xl overflow-hidden hover:shadow-md h-52 px-4 items-end flex aspect-[18/20] bg-[length:112%] hover:bg-[length:118%] transition-all"
            style={{
                backgroundImage: `url("${mediaPath(club.logoUrl, AvatarSizes.FULL)}")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }}
        >
            <div className="bg-white/40 rounded-xl backdrop-blur grid place-items-center px-3 py-1 mb-3 mt-auto w-full text-neutral-800 font-semibold text-2xl">
                {club.name}
            </div>
        </div>
    </Link>
)

export default ClubCard