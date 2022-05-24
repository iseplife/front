import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { AppContext } from "../../context/app/context"
import { useTranslation } from "react-i18next"
import SubscriptionButton from "../Subscription/SubscriptionButton"
import { SubscribableType } from "../../data/subscription/SubscribableType"
import { ClubPreview } from "../../data/club/types"
import { getAllClubs } from "../../data/club"
import { mediaPath } from "../../util"
import { AvatarSizes } from "../../constants/MediaSizes"

const FirstFollow: React.FC = () => {
    const { t } = useTranslation("notifications")
    const { state: { user } } = useContext(AppContext)
    const [clubs, setClubs] = useState<ClubPreview[]>([])
    const [error, setError] = useState(false)
    const loading = useMemo(() => !clubs.length && !error, [clubs, error])

    useEffect(() => {
        getAllClubs().then(res => 
            setClubs(res.data)
        ).catch(_ => setError(true))
    }, [])

    const [followed, setFollowed] = useState<number[]>([])

    const subscriptionCallback = useCallback((id: number) => {
        return (subscribed: boolean) => setFollowed(followed => subscribed ? [...followed, id] : followed.filter(otherId => otherId != id))
    }, [])

    return (
        <div className="fixed top-0 left-0 bg-black/40 backdrop-blur-sm w-screen h-screen z-[9999] flex flex-col p-3 box-border sm:p-0">
            <div className="w-full text-white text-center mt-5 sm:mt-10">
                <div className="text-5xl sm:text-7xl font-bold">
                    Suivez des associations
                </div>
                <div className="text-xl sm:text-3xl font-medium text-white/70 mt-3">
                    Vous devez suivre les associations pour voir leurs posts dans votre feed.
                    {/* Choisissez-en au moins 5 pour commencer ! */}
                </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-neutral-100 p-4 sm:p-8 m-auto my-6 sm:my-14 h-full max-w-full">
                {
                    clubs.map(club => 
                        <>
                            <div className="flex">
                                <img src={mediaPath(club.logoUrl, AvatarSizes.THUMBNAIL)}
                                    className="rounded-full h-14 w-14 sm:w-16 sm:h-16 "/>
                                <div className="ml-2 sm:ml-4">
                                    <div className="font-bold text-lg sm:text-xl mb-0.5">{club.name}</div>
                                    <div className="text-sm text-black/[65%] font-normal leading-4 w-96">
                                        {club.description}
                                    </div>
                                </div>
                                <div className="h-16 flex items-center ml-8">
                                    <SubscriptionButton id={club.id} subscribed={followed.includes(club.id)} type={SubscribableType.CLUB} updateSubscription={subscriptionCallback(club.id)} />
                                </div>
                            </div>
                            <div className="h-0.5 bg-black/5 w-full my-4 rounded-full"></div>
                        </>
                    )
                }

                <div className="absolute bottom-0 left-0 w-full text-neutral-500 bg-neutral-300/30 py-3 text-center font-semibold text-lg backdrop-blur-sm  ">Suivez encore au moins {5 - followed.length} assos </div>
            </div>
        </div>
    )
}
export default FirstFollow