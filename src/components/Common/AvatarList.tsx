import React from "react"
import {StudentPreview} from "../../data/student/types"
import {Link} from "react-router-dom"
import {AvatarSizes} from "../../constants/MediaSizes"
import StudentAvatar from "../Student/StudentAvatar"

type AvatarListProps = {
    users: StudentPreview[]
}

const AvatarList: React.FC<AvatarListProps> = ({users}) => {
    return (
        <div className="flex items-center" >
            { users.map(u =>
                <Link key={u.id} to={`/admin/user/${u.id}`} title={u.lastName.toUpperCase() + " " + u.firstName}>
                    <StudentAvatar
                        id={u.id}
                        name={u.firstName + " " + u.lastName}
                        picture={u.picture}
                        pictureSize={AvatarSizes.THUMBNAIL}
                        className="border-2 border-white -ml-2"
                    />
                </Link>
            )}
        </div>
    )
}
export default AvatarList