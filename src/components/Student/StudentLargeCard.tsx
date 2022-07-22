import { Link } from "react-router-dom"
import { AvatarSizes } from "../../constants/MediaSizes"
import { StudentPreview } from "../../data/student/types"
import StudentAvatar from "./StudentAvatar"

interface StudentLargeCardProps {
    student: StudentPreview
    className?: string
    onClick?: ()=>void
}

const StudentLargeCard: React.FC<StudentLargeCardProps> = ({student, className, onClick}) => (
    <Link to={`/student/${student.id}`} onClick={onClick}>
        <div className={`flex p-2 mb-5 items-center hover:bg-black transition-colors hover:bg-opacity-5 rounded-lg cursor-pointer ${className}`}>
            <StudentAvatar
                id={student.id}
                name={student.firstName + " " + student.lastName}
                picture={student.picture}
                pictureSize={AvatarSizes.THUMBNAIL}
                size="large"
            />
            <div>
                <h3 className="mx-2 mb-0 font-bold text-md text-gray-700 leading-4 mt-1 hidden lg:block">{student.firstName + " " + student.lastName}</h3>
                <h3 className="mx-2 mb-0 font-bold text-md text-gray-700 leading-4 mt-1 block lg:hidden">{student.firstName}</h3>
                <h6 className="mx-2 -mt-0.5 uppercase text-xs text-gray-600">{`Promo ${student.promo}`}</h6>
            </div>
        </div>
    </Link>
)
export default StudentLargeCard