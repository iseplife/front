import {Link} from "react-router-dom";
import {Avatar} from "antd";
import {Utils} from "../Common/Utils";
import React from "react";
import {StudentPreview} from "../../data/student/types";

type StudentCardProps = {
    student: StudentPreview
}

const StudentCard: React.FC<StudentCardProps> = ({student}) => (
    <Link
        className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-3/12 xl:w-1/5 text-center cursor-pointer no-underline text-gray-700"
        to={{
            pathname: `/discovery/student/${student.id}`
        }}>
        <Avatar
            src={student.picture} /*size={getStudentAvatarSize()}*/
            alt={student.firstName + student.lastName}
            className={"w-32 h-3 2 xl:w-48 xl:h-48 shadow-xl hover:shadow-outline" +
            " text-3xl" +
            " sm:text-5xl " +
            "md:text-5xl xl:text-6xl " + Utils.randomBackgroundColors()}
        />
        <p className="font-bold sm:text-xl">
            {student.firstName + " " + student.lastName}
            <br/>
            <span className="italic text-xs sm:text-sm">
                {'Promo ' + student.promo}
            </span>
        </p>
    </Link>
);

export default StudentCard;