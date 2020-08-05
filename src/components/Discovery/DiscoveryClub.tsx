import React, {useEffect, useState} from "react"
import {Skeleton} from "antd"
import {HorizontalSpacer} from "../../pages/discovery"
import {useTranslation} from "react-i18next"
import {getAllClubs} from "../../data/club"
import {ClubPreview} from "../../data/club/types"
import ClubCard from "./ClubCard"

const ClubLoader = [1, 2, 3, 4].map(i =>
    <Skeleton
        key={i}
        paragraph={{rows: 5}}
        loading={true}
        className="w-1/2 sm:w-1/3 md:w-1/3 lg:w-1/4 xl:w-1/4"
        active
        avatar
    />
)


const DiscoveryClub: React.FC = () => {
    const {t} = useTranslation("discovery")
    const [clubs, setClubs] = useState<ClubPreview[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    /**
     * Get all active clubs on first load
     */
    useEffect(() => {
        setLoading(true)
        getAllClubs().then(res => {
            setClubs(res.data)
        }).catch().finally(() => setLoading(false))
    }, [])

    return (
        <div className="container text-center mx-auto my-5">
            <div className="flex justify-center items-center font-bold text-indigo-500 py-3 text-4xl">
                {t("associations")}
                <span className="flex ml-2 text-lg">
                    {clubs.length !== 0 && `(${clubs.length})`}
                </span>
            </div>
            <HorizontalSpacer spacing={6}/>
            {/* List of Clubs */}
            <div className="flex flex-wrap justify-around">
                {!loading ?
                    clubs.map((club, i) =>
                        <ClubCard key={i} club={club}/>
                    ) :
                    <div className="flex flex-wrap flex-row w-full">
                        {ClubLoader}
                    </div>}
            </div>
        </div>
    )
}

export default DiscoveryClub