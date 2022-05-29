import React, { useCallback, useEffect, useMemo, useState } from "react"
import SubscriptionButton from "../Subscription/SubscriptionButton"
import { SubscribableType } from "../../data/subscription/SubscribableType"
import { ClubPreview } from "../../data/club/types"
import { getAllClubs } from "../../data/club"
import { mediaPath } from "../../util"
import { AvatarSizes } from "../../constants/MediaSizes"

const REQUIRED_FOLLOWING = 3

const FirstFollow: React.FC = () => {
    const [clubs, setClubs] = useState<ClubPreview[]>([])
    const [error, setError] = useState(false)
    const loading = useMemo(() => !clubs.length && !error, [clubs, error])

    useEffect(() => {
        getAllClubs().then(res => 
            setClubs(res.data.sort(() => 0.5 - Math.random()))
        ).catch(_ => setError(true))
    }, [])

    const [followed, setFollowed] = useState<number[]>([])

    const subscriptionCallback = useCallback((id: number) => {
        return (subscribed: boolean) => setFollowed(followed => subscribed ? [...followed, id] : followed.filter(otherId => otherId != id))
    }, [])

    return (
        <div className="fixed top-0 left-0 bg-black/40 backdrop-blur-sm w-screen h-screen z-[9999] flex flex-col box-border sm:p-3 ">
            <div className="w-full text-white text-center mt-5 sm:mt-10 hidden sm:block">
                <div className="text-5xl font-bold">
                    Suivez des associations
                </div>
                <div className="text-xl font-medium text-white/70 mt-3">
                    Vous devez suivre les associations pour voir leurs posts dans votre feed.
                </div>
            </div>
            <div className="py-2 px-4 text-black border-b bg-neutral-100 sm:hidden">
                <div className="text-2xl font-bold">Suivez des associations !</div>
                <div className="text-lg text-neutral-900">Vous verrez leurs posts dans votre feed</div>
            </div>
            <div className="relative sm:rounded-xl overflow-hidden bg-neutral-100 w-full sm:w-auto  m-auto sm:my-14 h-full max-w-full">
                <div className="overflow-auto h-full p-4 sm:p-8 ">
                    {
                        loading ?
                            new Array(10).fill(
                                <>
                                    <div className="flex animate-pulse">
                                        <div className="rounded-full h-14 w-14 sm:w-16 sm:h-16 bg-neutral-300 flex-shrink-0"/>
                                        <div className="w-full">
                                            <div className="flex justify-between">
                                                <div className="ml-2 sm:ml-4">
                                                    <div className="sm:mb-1 h-4 bg-neutral-300 w-20 sm:w-32" />
                                                    <div className="sm:w-72 lg:w-96 hidden sm:block bg-neutral-300 h-4" />
                                                    <div className="sm:w-72 lg:w-96 hidden sm:block bg-neutral-300 h-4 mt-1 origin-left scale-x-75" />
                                                    <div className="sm:w-72 lg:w-96 hidden sm:block bg-neutral-300 h-4 mt-1 origin-left scale-x-[85%]" />
                                                </div>
                                                <div className="mb-1.5 sm:mb-0 sm:h-16 flex sm:items-center ml-8">
                                                    <div className="w-[80px] sm:w-[150px] bg-indigo-400 rounded-full h-10 mr-2 flex-shrink-0"></div>
                                                </div>
                                            </div>
                                            <div className="ml-2 text-sm text-black/[65%] font-normal leading-4 sm:hidden mr-2">
                                                <div className="bg-neutral-300 h-4 w-full" />
                                                <div className="bg-neutral-300 h-4 mt-1 origin-left scale-x-75 w-full" />
                                                <div className="bg-neutral-300 h-4 mt-1 origin-left scale-x-[85%] w-full" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-0.5 bg-black/5 w-full my-4 rounded-full"></div>
                                </>
                            )
                            :
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
                                                        {club.description}{/* TODO: ellipsis */}
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
                        followed.length < REQUIRED_FOLLOWING ? 
                            <>Suivez encore au moins {REQUIRED_FOLLOWING - followed.length} assos</>
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