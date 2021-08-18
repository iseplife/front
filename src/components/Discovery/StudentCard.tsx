import React from "react"
import StudentAvatar from "../Student/StudentAvatar"

type StudentCardProps = {
    id: number
    fullname: string
    picture?: string
    promo: number
}

const StudentCard: React.FC<StudentCardProps> = React.memo(({id, fullname, picture, promo}) => (
    <StudentAvatar id={id} picture={picture} name={fullname} size={150} showPreview className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/5 text-gray-700 my-2">
        <div className="font-bold sm:text-xl">
            <p className="-mb-2">{fullname}</p>
            <span className="italic text-xs sm:text-sm">
                {"Promo " + promo}
            </span>
        </div>
    </StudentAvatar>
))
StudentCard.displayName = "StudentCard"

export default StudentCard