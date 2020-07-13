import React, {useEffect, useState} from "react"
import {Link, useParams} from "react-router-dom"
import StudentEditor from "../../../components/Student/StudentEditor"
import {getAllStudentsAdmin} from "../../../data/student"
import {StudentPreviewAdmin} from "../../../data/student/types"
import {Role} from "../../../data/security/types"
import {getRoles} from "../../../data/security"
import Table, {RowProps} from "../../../components/Common/TableAdmin"
import {Avatar} from "antd"
import {getEducationYear} from "../../../util"
import {UserOutlined} from "@ant-design/icons"
import Pills from "../../../components/Common/Pills"

export type PageStatus = {
    current: number
    size?: number
    total?: number
}
const tableConfig = [
    {title: "Nom", className: "w-64"},
    {title: "Promotion", className: "w-32"},
    {title: "Actif", className: "w-32"},
    {title: "Rôle"},
    {title: "", className: "w-24"}
]

const StudentPanel: React.FC = () => {
    const {id} = useParams()
    const [students, setStudents] = useState<StudentPreviewAdmin[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [page, setPage] = useState<PageStatus>({current: 0})
    const [roles, setRoles] = useState<Role[]>()

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
        <div>

            <div className="flex">
                <div className="w-full md:w-2/3">
                    <h1 className="font-dinotcb text-2xl text-gray-600">Utilisateurs</h1>
                    <Table
                        className=""
                        loading={loading}
                        data={students}
                        page={page}
                        onPageChange={(page) => setPage(prevState => ({...prevState, current: page}))}
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
        </div>
    )
}

const TableRow: React.FC<RowProps<StudentPreviewAdmin>> = ({data: s}) => (
	<tr key={s.id}>
		<td className="px-6 py-2 whitespace-no-wrap border-b border-gray-200">
			<div className="flex items-center">
				<div className="flex-shrink-0 h-10 w-10">
					<Avatar icon={<UserOutlined/>} src={s.picture}/>
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

export default StudentPanel