import React, { useCallback, useState } from "react"
import SubscriptionButton from "../Subscription/SubscriptionButton"
import { SubscribableType } from "../../data/subscription/SubscribableType"
import { ClubPreview } from "../../data/club/types"
import { mediaPath } from "../../util"
import { AvatarSizes } from "../../constants/MediaSizes"
import WebPPolyfill from "../Common/WebPPolyfill"
import CustomText from "../Common/CustomText"

type ClubFollowProps = {
    club: ClubPreview
    onSubscribe: (sub: boolean) => void
}
const ClubFollow: React.FC<ClubFollowProps> = ({club, onSubscribe}) => {
    const [subscribed, setSubscribed] = useState(false)
    const subscriptionCallback = useCallback((subscribed?: {extensive: boolean}) => {
        setSubscribed(!!subscribed)
        onSubscribe(!!subscribed)
    }, [])

    return (
        <>
            <div className="flex">
                <WebPPolyfill
                    src={mediaPath(club.logoUrl, AvatarSizes.THUMBNAIL)}
                    className="rounded-full h-14 w-14 sm:w-16 sm:h-16 flex-shrink-0"
                />
                <div className="w-full">
                    <div className="flex justify-between">
                        <div className="ml-2 sm:ml-4">
                            <div className="font-bold text-lg sm:text-xl sm:mb-0.5">{club.name}</div>
                            <div className="text-md text-neutral-400 mb-0.5 -mt-1 sm:hidden">Association</div>
                            <div className="text-sm text-black/[65%] font-normal leading-4 sm:w-72 lg:w-96 hidden sm:block">
                                <CustomText description={club.description} descLengthThrottle={310} disableSpacers disableLinks />{/* TODO: ellipsis */}
                            </div>
                        </div>
                        <div className="mb-1.5 sm:mb-0 sm:h-16 flex sm:items-center ml-8">
                            <SubscriptionButton
                                className="grid sm:w-[150px]"
                                id={club.id}
                                subscribed={subscribed}
                                type={SubscribableType.CLUB}
                                updateSubscription={subscriptionCallback}
                            />
                        </div>
                    </div>
                    <div className="ml-2 text-sm text-black/[65%] font-normal leading-4 sm:hidden">
                        <CustomText lineClamp description={club.description} descLengthThrottle={210} disableSpacers disableLinks />{/* TODO: ellipsis */}
                    </div>
                </div>
            </div>
            <div className="h-0.5 bg-black/5 w-full my-4 rounded-full"></div>
        </>
    )
}
export default ClubFollow