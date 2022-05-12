import SocialIcon from "../Common/SocialIcon"
import {faFacebook, faInstagram, faSnapchat} from "@fortawesome/free-brands-svg-icons"
import React, {useCallback, useContext, useMemo} from "react"
import ClubCover from "./ClubDescription/ClubCover"
import {ClubContext} from "../../context/club/context"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import {Avatar} from "antd"
import { ClubActionType } from "../../context/club/action"
import { SubscribableType } from "../../data/subscription/SubscribableType"
import SubscriptionHandler from "../Subscription"
import { cFaLinkWorld } from "../../constants/CustomFontAwesome"

const ClubHeader: React.FC = () => {
    const {club, dispatch} = useContext(ClubContext)
    const imageSrc = useMemo(() => (
        club.logoUrl?.startsWith("data:image") ?
            club.logoUrl :
            mediaPath(club.logoUrl, AvatarSizes.DEFAULT)
    ), [club.logoUrl])

    
    const onSubscriptionUpdate = useCallback((subscribed) => {
        dispatch({
            type: ClubActionType.UPDATE_CLUB,
            payload: {
                ...club,
                subscribed: subscribed ,
            }
        })
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
                            <SubscriptionHandler
                                type={SubscribableType.CLUB}
                                subscribable={club.id}
                                subscription={club.subscribed}
                                onUpdate={onSubscriptionUpdate}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center" style={{height: "min-content"}}>
                    {club.website && <SocialIcon icon={cFaLinkWorld} url={club.website}/>}
                    {club.facebook && <SocialIcon icon={faFacebook} url={club.facebook}/>}
                    {club.instagram && <SocialIcon icon={faInstagram} url={club.instagram}/>}
                    {club.snapchat && <SocialIcon icon={faSnapchat} url={club.snapchat}/>}
                </div>
            </div>
        </>
    )
}
export default ClubHeader
