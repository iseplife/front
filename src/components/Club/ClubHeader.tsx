import SocialIcon from "../Common/SocialIcon"
import {faFacebook, faFirefox, faInstagram, faSnapchat} from "@fortawesome/free-brands-svg-icons"
import React, {useContext, useMemo} from "react"
import ClubCover from "./ClubDescription/ClubCover"
import {ClubContext} from "../../context/club/context"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {Avatar} from "antd"

const ClubHeader: React.FC = () => {
    const {club} = useContext(ClubContext)
    const imageSrc = useMemo(() => (
        club.logoUrl?.startsWith("data:image") ?
            club.logoUrl :
            mediaPath(club.logoUrl, AvatarSizes.DEFAULT)
    ), [club.logoUrl])

    return (
        <>
            <ClubCover/>
            <div className="flex justify-between container p-3 mx-auto">
                <div className="flex">
                    <Avatar
                        src={imageSrc}
                        shape="circle"
                        className="-mt-13 md:-mt-16 w-20 h-20 md:w-32 md:h-32 shadow-md bg-white"
                    />
                    <div className="flex flex-col ml-4 md:-mt-2 mt-5">
                        <h1 className="text-black text-3xl mb-0 font-bold">{club.name}</h1>
                        {/* <h4 className="text-gray-500 text-md italic">{new Date(club.creation).toLocaleDateString()}</h4> */}
                    </div>
                </div>
                <div className="flex flex-wrap items-center" style={{height: "min-content"}}>
                    {club.website && <SocialIcon icon={faFirefox} url={club.website}/>}
                    {club.facebook && <SocialIcon icon={faFacebook} url={club.facebook}/>}
                    {club.instagram && <SocialIcon icon={faInstagram} url={club.instagram}/>}
                    {club.snapchat && <SocialIcon icon={faSnapchat} url={club.snapchat}/>}
                </div>
            </div>
        </>
    )
}
export default ClubHeader
