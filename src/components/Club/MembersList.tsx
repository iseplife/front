import React, {useContext} from "react"
import CardTextSkeleton from "./Skeletons/CardTextSkeleton"
import MemberCard from "./MemberCard"
import {ClubContext} from "../../context/club/context"

const MembersList: React.FC = () => {
    const {state: {members}} = useContext(ClubContext)
    return (
        <div className="w-full flex flex-col flex-wrap overflow-hidden">
            {members.loading ?
                <CardTextSkeleton loading={true} number={10} className="xl:w-56 lg:w-56 md:w-56 w-full m-1 h-24 shadow-md"/>
                :
                members.data && members.data.map(m =>
                    <MemberCard key={m.id} id={m.id} m={m}/>
                )
            }
        </div>
    )
}

export default MembersList