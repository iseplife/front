import React from "react"
import {ClubPreview} from "../../data/club/types"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"

type ClubCardProps = {
    club: ClubPreview
    className?: string
}
const ClubCard: React.FC<ClubCardProps> = ({club, className = ""}) => (
    <div className={`${className}`}>
        <div className="h-full mx-1 rounded shadow-md hover:shadow-xl bg-white">
            <div style={{height: "80%"}}>
                <div
                    className="w-full h-full mx-auto rounded-t rounded"
                    style={{
                        backgroundImage: `url("${mediaPath(club.logoUrl, AvatarSizes.DEFAULT)}")`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            </div>
            <div title={club.name} className="bg-white px-3" style={{height: "20%"}}>
                <h1 className="truncate text-xl text-center uppercase font-dinotcb">
                    {club.name}
                </h1>
            </div>
        </div>
    </div>
)

export default ClubCard