import React, {useEffect, useState} from "react"
import {ClubMember} from "../../../data/club/types"
import {getMembers} from "../../../data/club"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {getCurrentSchoolYear} from "../../../util"
import {faPencilAlt} from "@fortawesome/free-solid-svg-icons"
import MemberCard from "./MemberCard"
import ClubSchoolSessionsSelect from "./ClubSchoolSessionsSelect"
import ClubMemberSkeleton from "../../Skeletons/ClubMemberSkeleton"

type ClubMembersProps = {
    club: number
    hasRight: boolean
}
const ClubMembers: React.FC<ClubMembersProps> = ({club, hasRight}) => {
    const [loading, setLoading] = useState(true)
    const [members, setMembers] = useState<ClubMember[]>([])
    const [selectedYear, setSelectedYear] = useState<number>(getCurrentSchoolYear())

    useEffect(() => {
        setLoading(true)
        getMembers(club, selectedYear).then(res =>
            setMembers(res.data)
        ).finally(() => setLoading(false))
    }, [club, selectedYear])


    return (
        <div className="container mx-auto relative h-full py-4">
            <div className="flex justify-end item-center mb-2">
                <ClubSchoolSessionsSelect club={club} handleChange={setSelectedYear} />
                {hasRight && (
                    <div
                        onClick={undefined}
                        className="text-xl flex w-10 h-10 justify-center items-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer group mx-2"
                    >
                        <FontAwesomeIcon
                            className="cursor-pointer text-gray-700 text-opacity-60 mx-1 group-hover:text-opacity-100 transition-colors"
                            icon={faPencilAlt}
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-wrap justify-center h-full">
                {loading ?
                    //<Skeleton.Image className="shadow rounded-lg h-20 w-full sm:h-60 sm:w-44" />
                    <ClubMemberSkeleton amount={5} loading={true} />:
                    members.map(m => (
                        <MemberCard key={m.id} id={m.id} m={m} showRole={hasRight}/>
                    ))
                }
            </div>
        </div>
    )
}
export default ClubMembers
