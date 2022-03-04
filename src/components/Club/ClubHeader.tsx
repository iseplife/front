import SocialIcon from "../Common/SocialIcon"
import {faFacebook, faFirefox, faInstagram, faSnapchat} from "@fortawesome/free-brands-svg-icons"
import React, {useCallback, useContext, useMemo} from "react"
import ClubCover from "./ClubDescription/ClubCover"
import {ClubContext} from "../../context/club/context"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {Avatar} from "antd"
import { subscribe, unsubscribe } from "../../data/subscription"
import { ClubActionType } from "../../context/club/action"
import { SubscribableType } from "../../data/subscription/SubscribableType"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell as faSolidBell, faCheck } from "@fortawesome/free-solid-svg-icons"
import { faBell } from "@fortawesome/free-regular-svg-icons"

const ClubHeader: React.FC = () => {
    const {club, dispatch} = useContext(ClubContext)
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
                        className="-mt-13 md:mt-[-4.5rem] w-20 h-20 md:w-32 md:h-32 shadow-md bg-white"
                    />
                    <div className="flex ml-4 md:-mt-5 font-bold flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <h1 className="text-neutral-900 text-3xl mb-0 -mt-1 ml-0.5 sm:ml-0 mr-auto">{club.name}</h1>
                        <div className="flex">
                            <div onClick={handleSubscription} className={"py-1.5 cursor-pointer select-none rounded-full px-3.5 text-white text-base items-center flex " + (club.subscribed ? "border-blue-500 border-2 text-blue-500 hover:text-opacity-80 hover:border-opacity-80" : "bg-blue-500 hover:bg-opacity-90")}>{club.subscribed ? "Unfollow" : "Follow"}</div>
                            {club.subscribed &&
                                <div className="w-12 grid place-items-center relative ml-0 mr-auto">
                                    <FontAwesomeIcon onClick={handleExtensive} icon={club.subscribed.extensive ? faSolidBell : faBell} className="text-blue-500 text-2xl cursor-pointer hover:text-opacity-90" />
                                    {club.subscribed?.extensive &&
                                        <FontAwesomeIcon icon={faCheck} className="top-1.5 right-[3px] pointer-events-none text-blue-500 cursor-pointer text-sm absolute transform scale-75" />
                                    }
                                </div>
                            }
                        </div>
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
