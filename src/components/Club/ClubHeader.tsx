import ClubLogo from "./ClubLogo"
import {Skeleton} from "antd"
import SocialIcon from "../Common/SocialIcon"
import {faFacebook, faFirefox, faInstagram, faSnapchat} from "@fortawesome/free-brands-svg-icons"
import React, {useContext} from "react"
import ClubCover from "./ClubDescription/ClubCover"
import {ClubContext} from "../../context/club/context"

const ClubHeader: React.FC = () => {
    const {state} = useContext(ClubContext)

    return (
        <>
            <ClubCover/>
            <div className="flex justify-between container p-3 mx-auto">
                <div className="flex">
                    <ClubLogo/>
                    <div className="flex flex-col ml-4 md:mt-0 -mt-4">
                        {state.club.loading || !state.club.data ?
                            <>
                                <Skeleton className="w-64" active title paragraph={false}/>
                                <Skeleton className="w-32" active title paragraph={false}/>
                            </> :
                            <>
                                <h1 className="text-gray-700 text-3xl mb-0 font-bold">{state.club.data.name}</h1>
                                <h4 className="text-gray-500 text-md italic">{new Date(state.club.data.creation).toLocaleDateString()}</h4>
                            </>
                        }
                    </div>
                </div>
                {state.club.data && (
                    <div className="flex flex-wrap items-center" style={{height: "min-content"}}>
                        {state.club.data.website && <SocialIcon icon={faFirefox} url={state.club.data.website}/>}
                        {state.club.data.facebook && <SocialIcon icon={faFacebook} url={state.club.data.facebook}/>}
                        {state.club.data.instagram && <SocialIcon icon={faInstagram} url={state.club.data.instagram}/>}
                        {state.club.data.snapchat && <SocialIcon icon={faSnapchat} url={state.club.data.snapchat}/>}
                    </div>
                )}
            </div>
        </>
    )
}
export default ClubHeader
