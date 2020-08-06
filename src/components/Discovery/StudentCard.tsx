import {Link} from "react-router-dom"
import {Avatar} from "antd"
import {Utils} from "../Common/Utils"
import React from "react"

type StudentCardProps = {
    id: number
    fullname: string
    picture?: string
    promo: number
}

const StudentCard: React.FC<StudentCardProps> = React.memo(({id, fullname, picture, promo}) => (
    <Link
        className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-3/12 xl:w-1/5 text-center cursor-pointer no-underline text-gray-700"
        to={{
            pathname: `/discovery/student/${id}`
        }}>
        <Avatar
            src={picture}
            alt={fullname}
            className={"w-32 h-32 xl:w-48 xl:h-48 shadow-xl hover:shadow-outline" +
            " text-3xl" +
            " sm:text-5xl " +
            "md:text-5xl xl:text-6xl " + Utils.randomBackgroundColors()}
        />
        <p className="font-bold sm:text-xl">
            {fullname}
            <br/>
            <span className="italic text-xs sm:text-sm">
                {"Promo " + promo}
            </span>
        </p>
    </Link>
))
StudentCard.displayName = "StudentCard"

export default StudentCard