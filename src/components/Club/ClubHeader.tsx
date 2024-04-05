import SocialIcon from "../Common/SocialIcon"
import {faFacebook, faInstagram, faSnapchat} from "@fortawesome/free-brands-svg-icons"
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react"
import ClubCover from "./ClubDescription/ClubCover"
import {ClubContext} from "../../context/club/context"
import {mediaPath} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import { ClubActionType } from "../../context/club/action"
import { SubscribableType } from "../../data/subscription/SubscribableType"
import SubscriptionHandler from "../Subscription"
import { cFaLinkWorld } from "../../constants/CustomFontAwesome"
import WebPPolyfill, { WebPAvatarPolyfill } from "../Common/WebPPolyfill"
import { Subscription } from "../../data/feed/types"
import EasterEgg from "../EasterEgg/EasterEgg"


const ClubHeader: React.FC = () => {
    const {state: {cache, club}, dispatch} = useContext(ClubContext)
    const imageSrc = useMemo(() => (
        club?.logoUrl?.startsWith("data:image") ?
            club?.logoUrl :
            mediaPath(club?.logoUrl ?? cache?.thumbnail ?? cache?.logoUrl ?? cache?.thumbURL, AvatarSizes.DEFAULT)
    ), [club?.logoUrl, cache?.thumbnail, cache?.logoUrl, cache?.thumbURL])
    const imageLowSrc = useMemo(() => 
        mediaPath(club?.logoUrl ?? cache?.thumbnail ?? cache?.logoUrl ?? cache?.thumbURL, AvatarSizes.THUMBNAIL)
    , [club?.logoUrl, cache?.thumbnail, cache?.logoUrl, cache?.thumbURL])

    const onSubscriptionUpdate = useCallback((subscribed: Subscription) => {
        console.log("content : ",subscribed)
        dispatch({
            type: ClubActionType.UPDATE_SUB,
            payload: subscribed,
        })
    }, [club])

    const getLogo = () => {
        if(!club?.logoUrl || club.logoUrl.split("/")[1] === "clb"){
            console.log(imageSrc)
            return imageSrc
        }
        return club.logoUrl
    }
    return (
        <>
            <ClubCover/>
            <div className="flex justify-between container p-3 mx-auto">
                <div className="flex">
                    <div className="relative">
                        <div className="rounded-full w-full bg-neutral-50 absolute md:top-[-4.5rem] aspect-square"></div>
                        <div className="rounded-full w-full bg-neutral-200 animate-pulse md:top-[-4.5rem] absolute aspect-square"></div>
                        <WebPAvatarPolyfill
                            src={getLogo()}
                            className="-mt-13 md:mt-[-4.5rem] w-20 h-20 md:w-32 md:h-32 bg-white !bg-transparent absolute"
                        />
                        <WebPAvatarPolyfill
                            src={getLogo()}
                            className="-mt-13 md:mt-[-4.5rem] w-20 h-20 md:w-32 md:h-32 shadow-md !bg-transparent z-10 flex-shrink-0"
                        />
                    </div>
                    <div className="flex ml-4 md:-mt-5 font-bold flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                        <h1 className="text-neutral-900 text-3xl mb-0 -mt-1 ml-0.5 sm:ml-0 mr-auto">{(club ?? cache)?.name}</h1>
                        <div className="flex">
                            <SubscriptionHandler
                                type={SubscribableType.CLUB}
                                subscribable={club?.id}
                                subscription={club?.subscribed}
                                onUpdate={onSubscriptionUpdate}
                            />
                        </div>
                    </div>
                </div>
                {club?.id === 95?
                    <div className={"mt-4 mx-2"}>
                        <EasterEgg id={4} name={"de la boisson"}></EasterEgg>
                    </div>
                    :
                    <></>
                }

                {club?.id === 233880?
                    <div className={"mt-4 mx-2"}>
                        <EasterEgg id={9} name={"du farfadet"}></EasterEgg>
                    </div>
                    :
                    <></>
                }

                {club?.id === 89?
                    <div className={"mt-4 mx-2"}>
                        <EasterEgg id={10} name={"avec la main verte"}></EasterEgg>
                    </div>
                    :
                    <></>
                }
                <div className="flex flex-wrap items-center" style={{height: "min-content"}}>
                    {club?.website && <SocialIcon icon={cFaLinkWorld} url={club.website}/>}
                    {club?.facebook && <SocialIcon icon={faFacebook} url={club.facebook}/>}
                    {club?.instagram && <SocialIcon icon={faInstagram} url={club.instagram}/>}
                    {club?.snapchat && <SocialIcon icon={faSnapchat} url={club.snapchat}/>}
                </div>
            </div>
        </>
    )
}
export default ClubHeader
