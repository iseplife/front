import React from "react";
import {useParams} from "react-router-dom";
import StudentsTable from "../../../components/Student/StudentsTable";
import StudentEditor from "../../../components/Student/StudentEditor";


const Student: React.FC = () => {
    const {id} = useParams();

    return (
        <div>
            <h1 className="font-dinotcb text-2xl text-gray-600">Utilisateurs</h1>
            <div className="flex">
            <StudentsTable/>
            <StudentEditor id={id} />
            </div>
        </div>
    )
};

export default Student;