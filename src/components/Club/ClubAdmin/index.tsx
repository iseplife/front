import React from "react"
import ClubEditForm from "./ClubEditForm"
import ClubLogoForm from "./ClubLogoForm"


const ClubAdmin: React.FC = () => {
    return (
        <div className="container flex flex-wrap justify-around mx-auto">
            <ClubLogoForm />
            <ClubEditForm/>
        </div>
    )
}
export default ClubAdmin
