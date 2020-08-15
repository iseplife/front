import React from "react"
import ClubEditForm from "./ClubEditForm"
import {Club, ClubMember} from "../../../data/club/types"
import ClubMemberManager from "./ClubMemberManager"

type ClubAdminProps = {
    club: Club
    members: ClubMember[]
}
const ClubAdmin: React.FC<ClubAdminProps> = ({club, members}) => {
    return (
        <div className="container mx-auto">
            <div className="flex flex-wrap">
                <div className="md:w-2/5 w-full">
                    <ClubEditForm club={club}/>
                </div>
                <div className="md:w-3/5 w-full">
                    <ClubMemberManager club={club.id} members={members}/>
                </div>
            </div>
        </div>
    )
}
export default ClubAdmin