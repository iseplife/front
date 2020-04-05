import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import StudentsTable from "../../../components/Student/StudentsTable";
import StudentEditor from "../../../components/Student/StudentEditor";
import {getAllStudentsAdmin} from "../../../data/student";
import {Student as StudentType} from "../../../data/student/types";


export type PageStatus = {
    current: number
    size?: number
    total?: number
}

const Student: React.FC = () => {
    const [students, setStudents] = useState<StudentType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<PageStatus>({current: 0});

    /**
     * Fetch students first page on first load
     */
    useEffect(() => {
        setLoading(true);
        getAllStudentsAdmin(page.current).then(res => {
            if (res.status === 200) {
                setStudents(res.data.content);

                setPage(prevState => ({
                    ...prevState,
                    size: res.data.size,
                    total: res.data.totalElements
                }));
            }
        }).finally(() => setLoading(false))
    }, [page.current]);


    const {id} = useParams();
    return (
        <div>
            <h1 className="font-dinotcb text-2xl text-gray-600">Utilisateurs</h1>
            <div className="flex">
                <StudentsTable
                    loading={loading}
                    students={students}
                    page={page}
                    onPageChange={(page) => setPage(prevState => ({...prevState, current: page}))}
                />
                <StudentEditor
                    id={id}
                    onDelete={id => setStudents(students => students.filter(s => s.id !== id))}
                    onCreate={student => setStudents(students => [...students, student])}
                    onUpdate={student => setStudents(students => students.map(s => s.id === student.id ? student : s))}
                    onArchive={(id, archived) => setStudents(students => students.filter(s => s.id !== id))}
                />
            </div>
        </div>
    )
};

export default Student;