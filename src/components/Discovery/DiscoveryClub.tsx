import React, {useEffect, useState} from "react"
import {getAllClubs} from "../../data/club"
import {ClubPreview} from "../../data/club/types"
import ClubCard from "./ClubCard"

const ClubLoader = [1, 2, 3, 4].map(() =>
    <div className="mx-1 bg-neutral-300 animate-pulse rounded-2xl overflow-hidden hover:shadow-sm transition-shadow h-52 px-4 items-end flex aspect-[18/20]">
        <div className="bg-white/40 rounded-xl backdrop-blur grid place-items-center px-3 py-1 mb-3 mt-auto w-full text-neutral-800 font-semibold text-2xl h-9" />
    </div>
)


const DiscoveryClub: React.FC = () => {
    const [clubs, setClubs] = useState<ClubPreview[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    /**
     * Get all active clubs on first load
     */
    useEffect(() => {
        setLoading(true)
        getAllClubs().then(res => {
            setClubs(res.data)
        }).finally(() => setLoading(false))
    }, [])

    return (
        <div className="mx-auto my-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 place-items-center mt-10 gap-5">
            {!loading ?
                clubs.map((club, i) =>
                    <ClubCard key={i} club={club}/>
                ) : ClubLoader
            }
        </div>
    )
}

export default DiscoveryClub