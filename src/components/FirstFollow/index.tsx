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
            setClubs(res.data.sort(() => +(Math.random() > 0.5)))
        ).catch(_ => setError(true))
    }, [])

    const [followed, setFollowed] = useState<number[]>([])

    const subscriptionCallback = useCallback((id: number) => {
        return (subscribed: boolean) => setFollowed(followed => subscribed ? [...followed, id] : followed.filter(otherId => otherId != id))
    }, [])

    return (
        <div className="fixed top-0 left-0 bg-black/40 backdrop-blur-sm w-screen h-screen z-[9999] flex flex-col box-border sm:p-3 ">
            <div className="w-full text-white text-center mt-5 sm:mt-10 hidden sm:block">
                <div className="text-5xl sm:text-7xl font-bold">
                    Suivez des associations
                </div>
                <div className="text-xl sm:text-3xl font-medium text-white/70 mt-3">
                    Vous devez suivre les associations pour voir leurs posts dans votre feed.
                    {/* Choisissez-en au moins 5 pour commencer ! */}
                </div>
            </div>
            <div className="py-2 px-4 text-black border-b bg-neutral-100 sm:hidden">
                <div className="text-2xl font-bold">Suivez des associations !</div>
                <div className="text-lg text-neutral-900">Vous verrez leurs posts dans votre feed</div>
            </div>
            <div className="relative sm:rounded-xl overflow-hidden bg-neutral-100 w-full sm:w-auto  m-auto sm:my-14 h-full max-w-full">

                <div className="overflow-auto h-full p-4 sm:p-8">
                    {
                        clubs.map(club => 
                            <>
                                <div className="flex">
                                    <img src={mediaPath(club.logoUrl, AvatarSizes.THUMBNAIL)} className="rounded-full h-14 w-14 sm:w-16 sm:h-16 "/>
                                    <div>
                                        <div className="flex justify-between">
                                            <div className="ml-2 sm:ml-4">
                                                <div className="font-bold text-lg sm:text-xl sm:mb-0.5">{club.name}</div>
                                                <div className="text-md text-neutral-400 mb-0.5 -mt-1 sm:hidden">Association</div>
                                                <div className="text-sm text-black/[65%] font-normal leading-4 sm:w-72 lg:w-96 hidden sm:block">
                                                    {club.description}
                                                </div>
                                            </div>
                                            <div className="mb-1.5 sm:mb-0 sm:h-16 flex sm:items-center ml-8">
                                                <SubscriptionButton className="hidden sm:grid w-[150px]"  id={club.id} subscribed={followed.includes(club.id)} type={SubscribableType.CLUB} updateSubscription={subscriptionCallback(club.id)} />
                                                <SubscriptionButton className="sm:hidden" id={club.id} subscribed={followed.includes(club.id)} type={SubscribableType.CLUB} updateSubscription={subscriptionCallback(club.id)} />
                                            </div>
                                        </div>
                                        <div className="ml-2 text-sm text-black/[65%] font-normal leading-4 sm:hidden">
                                            {club.description}
                                        </div>
                                    </div>
                                </div>
                                <div className="h-0.5 bg-black/5 w-full my-4 rounded-full"></div>
                            </>
                        )
                    }

                </div>
                <div className="absolute bottom-0 left-0 w-full text-neutral-500 bg-neutral-300/30 py-3 text-center font-semibold text-lg backdrop-blur-md">
                    {
                        followed.length < 5 ? 
                            <>Suivez encore au moins {5 - followed.length} assos</>
                            :
                            <div className="flex">
                                <div className="ml-auto mr-4 rounded-full px h-10 font-bold cursor-pointer select-none text-base grid place-items-center bg-indigo-400 hover:bg-opacity-90 px-5 text-white">
                                    Suivant
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}
export default FirstFollow