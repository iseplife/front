import React, {useCallback, useState} from "react"
import {Button, message, Upload} from "antd"
import Table, {RowProps} from "../Common/TableAdmin"
import {PageStatus} from "../../pages/admin/student"
import {StudentPreview} from "../../data/student/types"
import {importStudent} from "../../data/student"
import ImportedAvatar from "../Common/ImportedAvatar"
import {RcFile} from "antd/es/upload"
import {faSyncAlt, faUpload} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

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

const DEFAULT_PAGE_SIZE = 10
const StudentsImport: React.FC = () => {
    const [pageImport, setPageImport] = useState<PageStatus>({current: 0, size: DEFAULT_PAGE_SIZE})

    const [hideUploadDiv, setHideUploadDiv] = useState<boolean>(false)
    const [importedStudents, setImportedStudents] = useState<StudentStore[]>([])
    const [loadingImport, setLoadingImport] = useState<boolean>(false)


    const uploadCSVFile = useCallback((file: RcFile) => {
        setLoadingImport(true)
        const csvFile = file.type === "text/csv" || file.type === "application/vnd.ms-excel"
        if (!csvFile) {
            message.error("You can only upload CSV File")
        }
        const reader = new FileReader()
        reader.onload = () => {
            const text = reader.result as string
            const students = readCSVToObject(text)
            setImportedStudents(students)
            setPageImport({
                current: 0,
                size: DEFAULT_PAGE_SIZE,
                total: students.length
            })
            setLoadingImport(false)
        }
        reader.readAsText(file)
        setHideUploadDiv(true)
        return false
    }, [])

    const uploadImages = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return

        const importedStudentsWithFile: StudentStore[] = []
        Array.from(event.target.files).forEach(file => {
            const id = file.name.split(".")[0]
            const studentWithFileImported = importedStudents.find((i: StudentStore) => i.student.id.toString() === id)

            if (studentWithFileImported) {
                studentWithFileImported.file = file
                importedStudentsWithFile.push(studentWithFileImported)
            }
        })

        const importedStudentIdsWithFile = importedStudentsWithFile.map(i => i.student.id)
        const importedStudentFilteredByFileReady = importedStudents.filter(i => !importedStudentIdsWithFile.includes(i.student.id))

        setImportedStudents([
            ...importedStudentsWithFile,
            ...importedStudentFilteredByFileReady
        ])

    }, [importedStudents])


    const readCSVToObject = (csv: string) => {
        const result: StudentStore[] = []
        csv.split("\n").forEach(line => {
            if (line.length !== 0) {
                const column = line.split(",")
                result.push({
                    student: {
                        id: +column[0],
                        firstName: column[1],
                        lastName: column[2],
                        promo: +column[3]
                    }
                })
            }
        })
        return result
    }

    const uploadStudents = useCallback(() => {
        importedStudents.forEach(({student, file}) => {
            importStudent(student, file).then(res => console.log(res))
        })
    }, [importedStudents])

    const reset = useCallback(() => {
        setImportedStudents([])
        setHideUploadDiv(false)
    }, [])

    return (
        <div>
            <div className={`flex flex-col items-center ${hideUploadDiv ? "hidden" : "block"}`}>
                <h3 className="font-bold text-gray-700">Information :</h3>
                <p className="text-gray-700 text-center">
                    le fichier doit être un CSV (séparation virgule) suivant le pattern : <br/>
                    <strong>numéro étudiant, prénom, nom, année de promotion</strong>
                </p>
                <Upload name="csv" beforeUpload={uploadCSVFile} multiple={false} accept=".csv">
                    <Button icon={<FontAwesomeIcon icon={faUpload}/>} className="rounded">Importer des étudiants</Button>
                </Upload>
            </div>
            <div className={`${hideUploadDiv ? "block" : "hidden"} flex justify-center mb-4`}>
                <label
                    className=" bg-indigo-500 text-white rounded cursor-pointer py-1 px-2 hover:shadow-md hover:bg-opacity-75 transition ease-in duration-200">
                    <input
                        type="file"
                        multiple={true}
                        accept="image/jpeg, image/png, image/gif, image/bmp"
                        className="overflow-hidden absolute opacity-0 z-0 w-1 h-1 "
                        onChange={uploadImages}
                    />
                    <FontAwesomeIcon icon={faUpload} className="px-2"/>
                    Upload Student Images
                </label>


                <Button
                    type="primary"
                    className={`${hideUploadDiv ? "block" : "hidden"} shadow-md mx-4 rounded`}
                    onClick={uploadStudents}
                >
                    Enregistrer
                </Button>
                <Button
                    type="primary"
                    className="shadow-md py-1 px-2 text-white rounded border-yellow-500 bg-yellow-500"
                    onClick={reset}
                >
                    <FontAwesomeIcon icon={faSyncAlt} className="pr-2"/>
                    Reset
                </Button>
            </div>

            <Table
                className={`${hideUploadDiv ? "block" : "hidden"} w-min mx-auto`}
                columns={importTableConfig}
                data={importedStudents.slice(
                    pageImport.current * (pageImport.size || DEFAULT_PAGE_SIZE), (pageImport.current + 1) * (pageImport.size || DEFAULT_PAGE_SIZE)
                )}
                loading={loadingImport}
                page={pageImport}
                onPageChange={(page) => setPageImport(prevState => ({...prevState, current: page}))}
                onSizeChange={(current, size) => setPageImport(p => ({...p, size}))}
                row={TableImportRow}
            />
        </div>
    )
}

const TableImportRow: React.FC<RowProps<StudentStore>> = ({data: {student, file}}) => (
    <tr key={student.id}>
        <td className="px-6 py-1 whitespace-no-wrap border-b border-gray-200">
            <ImportedAvatar file={file}/>
        </td>
        <td className="px-6 font-semibold font-medium text-gray-900 border-b border-gray-200 whitespace-no-wrap">{student.firstName}</td>
        <td className="px-6 font-semibold font-medium text-gray-900 border-b border-gray-200 whitespace-no-wrap">{student.lastName}</td>
        <td className="px-6 border-b border-gray-200 whitespace-no-wrap">n°{student.id}</td>
        <td className="px-6 border-b border-gray-200 whitespace-no-wrap">{student.promo}</td>
    </tr>
)

export default StudentsImport
