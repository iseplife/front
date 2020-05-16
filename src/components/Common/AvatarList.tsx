import React from "react";
import {StudentPreview} from "../../data/student/types";
import {Avatar} from "antd";
import {Link} from "react-router-dom";

type AvatarListProps = {
    users: StudentPreview[]
}

const AvatarList: React.FC<AvatarListProps> = ({users}) => {
    return (
        <div className="flex items-center" >
            { users.map(u =>
                <Link key={u.id} to={`/admin/user/${u.id}`} title={u.lastName.toUpperCase() + ' ' + u.firstName}>
                    <Avatar  className="border-2 border-white -ml-2" icon="user" src={u.picture}/>
                </Link>
            )}
        </div>
    )
}
export default AvatarList;