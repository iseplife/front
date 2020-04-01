import React, {useEffect, useState} from "react";
import {Student} from "../../data/student/types";
import {getStudent} from "../../data/student";
import {message} from "antd";

interface StudentEditorProps {
    id?: string
}

const StudentEditor: React.FC<StudentEditorProps> = ({id}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [student, setStudent] = useState<Student>();

    useEffect(() => {
        if (id && +id) {
            setLoading(true);
            getStudent(+id).then(res => {
                if(res.status === 200){
                    setStudent(res.data);
                }else {
                    message.error("Utilisateur inconnu: " + id)
                }
            }).finally(() => setLoading(false))
        }else {
            message.error("Utilisateur inconnu: " + id)
        }
    }, [id]);
    return (
        <div className="bg-white shadow rounded w-full md:w-1/3 min-h-screen mx-2">

        </div>
    )
};

export default StudentEditor;