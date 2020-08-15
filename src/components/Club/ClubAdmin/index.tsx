import React from "react"
import ClubEditForm from "./ClubEditForm"
import ClubMemberManager from "./ClubMemberManager"


const ClubAdmin: React.FC = () => {
    return (
        <div className="container mx-auto">
            <div className="flex flex-wrap">
                <div className="md:w-2/5 w-full">
                    <ClubEditForm/>
                </div>
                <div className="md:w-3/5 w-full">
                    <ClubMemberManager/>
                </div>
            </div>
        </div>
    )
}
export default ClubAdmin