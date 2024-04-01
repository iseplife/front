import React from "react"
import { StudentPreview } from "../../data/student/types"
import StudentAvatar from "../Student/StudentAvatar"
import { AvatarSizes } from "../../constants/MediaSizes"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircle } from "@fortawesome/free-solid-svg-icons"

type CompressedMembersProps = {
    members: StudentPreview[]
    className?: string
    onClick?: () => void
}
const CompressedMembers: React.FC<CompressedMembersProps> = ({ members, className, onClick }) => {
    return <div className={"flex " + className} onClick={onClick}> {
        members.slice(0, 9).map((student, index, array) =>
            <div className="-mr-1.5 relative" style={{ zIndex: 10 - index }} title={`${student.firstName} ${student.lastName}`} key={index}>
                {array.length - 1 == index && array.length != members.length && <div className="rounded-full bg-black/[42%] absolute w-full h-full z-10 text-gray-300 items-center justify-center flex text-xs border-[#fff5e8] border-2">
                    <div className="transform scale-50 flex">
                        <FontAwesomeIcon icon={faCircle} size="xs" className="mr-0.5"></FontAwesomeIcon>
                        <FontAwesomeIcon icon={faCircle} size="xs" className="mr-0.5"></FontAwesomeIcon>
                        <FontAwesomeIcon icon={faCircle} size="xs"></FontAwesomeIcon>
                    </div>
                </div>}
                <StudentAvatar
                    id={student.id}
                    name=""
                    picture={student.picture}
                    pictureSize={AvatarSizes.THUMBNAIL}
                    className="border-[#fff5e8] border-2 rounded-full"
                    size="small"
                />
            </div>
        )
    } </div>
}

export default CompressedMembers
