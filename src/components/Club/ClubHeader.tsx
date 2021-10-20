import ClubLogo from "./ClubLogo"
import SocialIcon from "../Common/SocialIcon"
import {faFacebook, faFirefox, faInstagram, faSnapchat} from "@fortawesome/free-brands-svg-icons"
import React, {useContext} from "react"
import ClubCover from "./ClubDescription/ClubCover"
import {ClubContext} from "../../context/club/context"

const ClubHeader: React.FC = () => {
    const {club} = useContext(ClubContext)

    return (
        <>
            <ClubCover/>
            <div className="flex justify-between container p-3 mx-auto">
                <div className="flex">
                    <ClubLogo/>
                    <div className="flex flex-col ml-4 md:mt-0 -mt-4">
                        <h1 className="text-gray-700 text-3xl mb-0 font-bold">{club.name}</h1>
                        <h4 className="text-gray-500 text-md italic">{new Date(club.creation).toLocaleDateString()}</h4>
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
