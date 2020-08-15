import React from "react"
import {ClubMember} from "../../data/club/types"
import CardTextSkeleton from "./Skeletons/CardTextSkeleton"
import MemberCard from "./MemberCard"

type MembersListProps = {
    members: ClubMember[]
    loading: boolean
}
const MembersList: React.FC<MembersListProps> = ({members, loading}) => {
    return (
        <div className="w-full flex flex-col flex-wrap overflow-hidden">
            {loading ?
                <CardTextSkeleton loading={loading} number={10} className="xl:w-56 lg:w-56 md:w-56 w-full m-1 h-24 shadow-md"/>
                :
                members.map(m =>
                    <MemberCard key={m.id} m={m}/>
                )
            }
        </div>
    )
}

export default MembersList