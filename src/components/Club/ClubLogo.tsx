import React, {useContext} from "react"
import {Avatar} from "antd"
import {ClubContext} from "../../context/club/context"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {faCircleNotch} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"


const ClubLogo: React.FC = () => {
    const {club} = useContext(ClubContext)

    return (
        <Avatar src={mediaPath(club.logoUrl, AvatarSizes.DEFAULT)} shape="circle" className="-mt-8 w-20 h-20 md:w-32 md:h-32 shadow-md bg-white">
            <FontAwesomeIcon icon={faCircleNotch} spin size="2x" className="text-white mt-6"/>
        </Avatar>
    )
}
export default ClubLogo
