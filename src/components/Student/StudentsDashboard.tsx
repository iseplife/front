import React, {useEffect, useState} from "react"
import Table, {RowProps} from "../Common/TableAdmin"
import StudentEditor from "./StudentEditor"
import {Link, useParams} from "react-router-dom"
import {StudentPreviewAdmin} from "../../data/student/types"
import {Role} from "../../data/security/types"
import {getRoles} from "../../data/security"
import {PageStatus} from "../../pages/admin/student"
import {getAllStudentsAdmin} from "../../data/student"
import {getEducationYear} from "../../util"
import {AvatarSizes} from "../../constants/MediaSizes"
import Pills from "../Common/Pills"
import StudentAvatar from "./StudentAvatar"

const tableConfig = [
    {title: "Nom", className: "w-64"},
    {title: "Promotion", className: "w-32"},
    {title: "Actif", className: "w-32"},
    {title: "Rôle"},
    {title: "", className: "w-24"}
]

interface ParamTypes {
    id?: string
}
const StudentsDashboard: React.FC = () => {
    const {id} = useParams<ParamTypes>()
    const [page, setPage] = useState<PageStatus>({current: 0})
    const [students, setStudents] = useState<StudentPreviewAdmin[]>([])
    const [roles, setRoles] = useState<Role[]>()
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        getRoles().then(res => {
            if (res.status) {
                setRoles(res.data)
            }
        })
    }, [])

    /**
     * Fetch students first page on first load
     */
    useEffect(() => {
        setLoading(true)
        getAllStudentsAdmin(page.current).then(res => {
            if (res.status === 200) {
                setStudents(res.data.content)

                setPage(prevState => ({
                    ...prevState,
                    size: res.data.size,
                    total: res.data.totalElements
                }))
            }
        }).finally(() => setLoading(false))
    }, [page.current])
    
    return (
        <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-2/3">
                <Table
                    className="overflow-x-auto"
                    loading={loading}
                    data={students}
                    page={page}
                    onPageChange={(page) => setPage(prevState => ({...prevState, current: page-1}))}
                    columns={tableConfig}
                    row={TableRow}
                />
            </div>
            <StudentEditor
                id={id}
                roles={roles}
                onDelete={id => setStudents(students => students.filter(s => s.id !== id))}
                onCreate={student => setStudents(students => [...students, student])}
                onUpdate={student => setStudents(students => students.map(s => s.id === student.id ? student : s))}
                onArchive={student => setStudents(students => students.map(s => s.id === student.id ? student : s))}
            />
        </div>
        
    )
}

const TableRow: React.FC<RowProps<StudentPreviewAdmin>> = ({data: s}) => (
    <tr key={s.id}>
        <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-200">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                    <StudentAvatar
                        id={s.id}
                        name={s.firstName + " " + s.lastName}
                        picture={s.picture}
                        pictureSize={AvatarSizes.THUMBNAIL}
                    />
                </div>
                <div className="ml-4 overflow-hidden">
                    <Link to={`/admin/user/${s.id}`}>
                        <div
                            className="text-sm leading-5 font-medium text-gray-900 hover:text-indigo-400 focus:outline-none focus:underline break-words"
                            title={s.lastName.toUpperCase() + " " + s.firstName}
                        >
                            {s.lastName.toUpperCase() + " " + s.firstName}
                        </div>
                    </Link>
                    <div className="text-sm leading-5 text-gray-500">n° {s.id}</div>
                </div>
            </div>
        </td>
        <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-200">
            <div className="text-sm leading-5 text-gray-900">
                {getEducationYear(s.promo)}
            </div>
            <div className="text-sm leading-5 text-gray-500">promo {s.promo}</div>
        </td>
        <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-200">
            <Pills status={!s.archived} className="text-xs"/>
        </td>
        <td className=" px-6 py-2 whitespace-no-wrap border-b border-gray-200 text-xs leading-5">
            <div className="flex flex-wrap">
                {s.roles.map((r, index) => (
                    <span key={index} className="rounded bg-indigo-300 text-white m-1 p-1">
                        {r.substr(5).replace(/_/g, " ")}
                    </span>
                ))}
            </div>
        </td>
        <td className="px-6 py-2 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium">
            <Link
                to={`/admin/user/${s.id}`}
                className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:underline"
            >
                Edit
            </Link>
        </td>
    </tr>
)

export default StudentsDashboard