import React, { useMemo } from "react"
import { Link } from "react-router-dom"
import { AvatarSizes } from "../../constants/MediaSizes"
import { StudentPreview } from "../../data/student/types"
import { mediaPath } from "../../util"
import LinkEntityPreloader from "../Optimization/LinkEntityPreloader"

type StudentCardProps = {
    student: StudentPreview
    className?: boolean | string
}

const StudentCard: React.FC<StudentCardProps> = React.memo(({ student, className }) => {
    const fullName = useMemo(() => `${student.firstName} ${student.lastName}`, [student.firstName, student.lastName])
    return (<LinkEntityPreloader preview={student}>
        <Link to={`/student/${student.id}`}>
            <div
                className={"relative bg-white rounded-2xl overflow-hidden hover:shadow-md h-52 px-3.5 items-end flex aspect-[18/20] cursor-pointer bg-[length:112%] hover:bg-[length:118%] transition-all " + className}
                style={{
                    backgroundImage: `url("${student.picture ? mediaPath(student.picture, AvatarSizes.FULL) : "img/icons/discovery/user.svg"}")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute right-2.5 top-2.5 bg-white/50 rounded-lg grid place-items-center px-2 py-0.5 text-neutral-700 font-normal text-lg">
                    {student.promo}
                </div>
                <div className="bg-white/50 rounded-xl backdrop-blur grid place-items-center px-2 py-2 leading-6 mb-3 mt-auto w-full text-neutral-900 font-semibold text-lg">
                    <div className="line-clamp-2 text-ellipsis" title={fullName}>
                        {fullName}
                    </div>
                </div>
            </div>
        </Link>
    </LinkEntityPreloader>)
})
StudentCard.displayName = "StudentCard"

export default StudentCard