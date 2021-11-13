import SocialIcon from "../Common/SocialIcon"
import {faFacebook, faFirefox, faInstagram, faSnapchat} from "@fortawesome/free-brands-svg-icons"
import React, {useContext, useMemo, useCallback} from "react"
import ClubCover from "./ClubDescription/ClubCover"
import {ClubContext} from "../../context/club/context"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {Avatar} from "antd"
import { subscribe, unsubscribe } from "../../data/subscription"
import { SubscribableType } from "../../data/subscription/SubscribableType"
import { ClubActionType } from "../../context/club/action"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell } from "@fortawesome/free-regular-svg-icons"
import { faBell as faSolidBell, faCheck } from "@fortawesome/free-solid-svg-icons"


const ClubHeader: React.FC = () => {
    const { club, dispatch } = useContext(ClubContext)
    const imageSrc = useMemo(() => (
        club.logoUrl?.startsWith("data:image") ?
            club.logoUrl :
            mediaPath(club.logoUrl, AvatarSizes.DEFAULT)
    ), [club.logoUrl])

    const handleSubscription = useCallback(() => {
        if (club) {
            const wasSubscribed = club.subscribed;
            (club.subscribed ? unsubscribe : subscribe)(club.id, SubscribableType.CLUB).then(_ => {
                dispatch({
                    type: ClubActionType.UPDATE_CLUB,
                    payload: {
                        ...club,
                        subscribed: wasSubscribed ? undefined : { extensive: false },
                    }
                })
            })
        }
    }, [club])
    const handleExtensive = useCallback(() => {
        if (club) {
            const newExtensive = !club.subscribed?.extensive
            subscribe(club.id, SubscribableType.CLUB, newExtensive).then(_ => {
                dispatch({
                    type: ClubActionType.UPDATE_CLUB,
                    payload: {
                        ...club,
                        subscribed: { extensive: newExtensive },
                    }
                })
            })
        }
    }, [club])

    return (
        <>
            <ClubCover/>
            <div className="flex justify-between container p-3 mx-auto">
                <div className="flex">
                    <Avatar
                        src={imageSrc}
                        shape="circle"
                        className="-mt-8 w-20 h-20 md:w-32 md:h-32 shadow-md bg-white"
                    />
                    <div className="flex flex-col ml-4 md:mt-0 -mt-4">
                        <h1 className="text-gray-700 text-3xl mb-0 font-bold flex items-center">
                            {club.name}
                            <div onClick={handleSubscription} className={"h-full ml-3 cursor-pointer select-none rounded-full px-3.5 text-white text-base items-center flex " + (club.subscribed ? "border-blue-500 border-2 text-blue-500 hover:text-opacity-80 hover:border-opacity-80" : "bg-blue-500 hover:bg-opacity-90")}>{club.subscribed ? "Unfollow" : "Follow"}</div>
                            
                            {club.subscribed &&
                                <div className="w-12 justify-center flex">
                                    <FontAwesomeIcon onClick={handleExtensive} icon={club.subscribed.extensive ? faSolidBell : faBell} className="text-blue-500 text-2xl cursor-pointer hover:text-opacity-90" />
                                    {club.subscribed?.extensive &&
                                        <FontAwesomeIcon icon={faCheck} className="pointer-events-none text-blue-500 cursor-pointer text-sm absolute ml-3.5 transform scale-75" />
                                    }
                                </div>
                            }
                        </h1>
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
