import React, {useCallback, useEffect, useState} from "react"
import {Link, useParams} from "react-router-dom"
import StudentEditor from "../../../components/Student/StudentEditor"
import {getAllStudentsAdmin} from "../../../data/student"
import {StudentPreview, StudentPreviewAdmin} from "../../../data/student/types"
import {Role} from "../../../data/security/types"
import {getRoles} from "../../../data/security"
import Table, {RowProps} from "../../../components/Common/TableAdmin"
import {Avatar, Button, message, Tabs, Upload} from "antd"
import {getEducationYear, mediaPath} from "../../../util"
import {UserOutlined} from "@ant-design/icons"
import Pills from "../../../components/Common/Pills"
import {AvatarSizes} from "../../../constants/MediaSizes"
import {UploadOutlined} from "@ant-design/icons"
import {importStudent} from "../../../data/student"

const {TabPane} = Tabs

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

const importTableConfig = [
    {title: "Photo", dataIndex: "picture", className: "w-16"},
    {title: "Prénom", dataIndex: "firstName", className: "w-32"},
    {title: "Nom", dataIndex: "lastName", className: "w-32"},
    {title: "Numéro élève", dataIndex: "id", className: "w-32"},
    {title: "Promotion", dataIndex: "promo", className: "w-32"}
]

type StudentStore = {
    student: StudentPreview,
    file?: Blob
}

const StudentPanel: React.FC = () => {
    const {id} = useParams()
    const [students, setStudents] = useState<StudentPreviewAdmin[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [page, setPage] = useState<PageStatus>({current: 0})
    const [pageImport, setPageImport] = useState<PageStatus>({current: 0})
    const [roles, setRoles] = useState<Role[]>()
    const [hideUploadDiv, setHideUploadDiv] = useState<boolean>(false)
    const [importedStudents, setImportedStudents] = useState<StudentStore[]>([])
    const [loadingImport, setLoadingImport] = useState<boolean>(false)

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

    const uploadCSVFile = useCallback((file: Blob) => {
        setLoadingImport(true)
        const csvFile = file.type === "text/csv" || file.type === "application/vnd.ms-excel"
        if (!csvFile) {
            message.error("You can only upload CSV File")
        }
        const reader = new FileReader()
        reader.onload = () => {
            const text = reader.result
            setImportedStudents(readCSVToObject(text))
        }
        reader.readAsText(file)
        setHideUploadDiv(true)
        setLoadingImport(false)
        return false
    }, [])

    const uploadImages = useCallback((event) => {
        const importedStudentsWithFile: StudentStore[] = []
        const files = event.target.files

        if (!files.length) {
            return
        }

        for (const file of files) {
            const id = file.name.split(".")[0]
            const studentWithFileImported = importedStudents.find((i: StudentStore) => i.student.id.toString() === id)

            if (studentWithFileImported) {
                studentWithFileImported.file = file
                importedStudentsWithFile.push(studentWithFileImported)
            }
        }

        const importedStudentIdsWithFile = importedStudentsWithFile.map(i => i.student.id)
        const importedStudentFilteredByFileReady = importedStudents.filter(i => !importedStudentIdsWithFile.includes(i.student.id))

        setImportedStudents([
            ...importedStudentsWithFile,
            ...importedStudentFilteredByFileReady
        ])

    }, [importedStudents])

    const readCSVToObject = (csv: any) => {
        const lines = csv.split("\n")
        const result = []

        for (const line of lines) {
            const currentLine = line.split(",")
            result.push({
                student: {
                    firstName: currentLine[0],
                    lastName: currentLine[1],
                    id: Number(currentLine[2]),
                    promo: Number(currentLine[3])
                }
            })
        }
        return result
    }

    const uploadStudents = () => {
        importedStudents.forEach(({student, file}) => {
            importStudent(student, file).then(res => console.log(res))
        })
    }

    return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab={"Utilisateurs"} key={1}>
                    <div className="flex">
                        <div className="w-full md:w-2/3">
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
                </TabPane>
                <TabPane tab={"Importation"} key={2}>
                    <div className={`flex justify-center ${hideUploadDiv ? "hidden" : "block"}`}>
                        <Upload name={"csv"} beforeUpload={uploadCSVFile} multiple={false} accept=".csv">
                            <Button icon={<UploadOutlined/>}>Click to upload a CSV file</Button>
                        </Upload>
                    </div>
                    <div className={`${hideUploadDiv ? "block" : "hidden"} flex justify-center mb-4`}>
                        <label
                            className="bg-indigo-500 text-white rounded cursor-pointer py-1 px-2 hover:shadow-md hover:bg-opacity-75 transition ease-in duration-200">
                            <input type="file" multiple={true} accept="image/jpeg, image/png, image/gif, image/bmp"
                                className="overflow-hidden absolute opacity-0 z-0 w-1 h-1"
                                onChange={uploadImages}/>
                            <UploadOutlined className="px-2"/>
                            Upload Student Images
                        </label>
                        <Button type="primary"
                            className={`${hideUploadDiv ? "block" : "hidden"} rounded shadow-md ml-12`}
                            onClick={uploadStudents}>Enregistrer</Button>
                    </div>
                    <Table
                        className={`${hideUploadDiv ? "block" : "hidden"} w-11/12 mx-auto`}
                        columns={importTableConfig}
                        data={importedStudents}
                        loading={loadingImport}
                        page={pageImport}
                        onPageChange={(page) => setPageImport(prevState => ({...prevState, current: page}))}
                        row={TableImportRow}/>

                </TabPane>
            </Tabs>
        </div>
    )
}

const ImportedAvatar: React.FC<{ file: Blob | undefined }> = ({file}) => {
    const [preview, setPreview] = useState<string>()
    useEffect(() => {
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }, [file])

    return (
        <Avatar icon={<UserOutlined/>} src={preview} className="h-10 w-10"/>
    )
}

const TableImportRow: React.FC<RowProps<StudentStore>> = ({data: {student, file}}) => (
    <tr key={student.id}>
        <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-200">
            <ImportedAvatar file={file}/>
        </td>
        <td className="px-6 font-bold border-b border-gray-200 whitespace-no-wrap">{student.firstName}</td>
        <td className="px-6 font-bold border-b border-gray-200 whitespace-no-wrap">{student.lastName}</td>
        <td className="px-6 font-bold border-b border-gray-200 whitespace-no-wrap">{student.id}</td>
        <td className="px-6 font-bold border-b border-gray-200 whitespace-no-wrap">{student.promo}</td>
    </tr>
)

const TableRow: React.FC<RowProps<StudentPreviewAdmin>> = ({data: s}) => (
    <tr key={s.id}>
        <td className="px-6 py-2 whitespace-no-wrap border-b border-gray-200">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                    <Avatar icon={<UserOutlined/>} src={mediaPath(s.picture, AvatarSizes.THUMBNAIL)}/>
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