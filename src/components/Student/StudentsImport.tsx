import React, {useCallback, useState} from "react"
import {Button, message, Upload, Input} from "antd"
import Table, {RowProps} from "../Common/TableAdmin"
import {PageStatus} from "../../pages/admin/student"
import {StudentPreview, StudentsImportData} from "../../data/student/types"
import {importStudents} from "../../data/student"
import ImportedAvatar from "../Common/ImportedAvatar"
import {RcFile} from "antd/es/upload"
import {faArrowLeft, faSearch, faSyncAlt, faUpload} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons"
import { ChangeEvent } from "react-router/node_modules/@types/react"

const importTableConfig = [
    {title: "Photo", dataIndex: "picture", className: "w-16"},
    {title: "Prénom", dataIndex: "firstName", className: "w-32"},
    {title: "Nom", dataIndex: "lastName", className: "w-32"},
    {title: "N°étudiant", dataIndex: "id", className: "w-32"},
    {title: "Promotion", dataIndex: "promo", className: "w-32"}
]



type ImportInfo = {
    lastStudent: StudentPreview,
    blobStudent: Blob | undefined,
    currentImported: number,
    totalImport: number
}

enum DisplayPage {
    AddCSV = 0,
    StudentTable = 1,
    Importing = 2
  }

const DEFAULT_PAGE_SIZE = 10
const StudentsImport: React.FC = () => {
    const [pageImport, setPageImport] = useState<PageStatus>({current: 0, size: DEFAULT_PAGE_SIZE})

    const [importedStudents, setImportedStudents] = useState<StudentsImportData[]>([])
    const [importedStudentsDisplayed, setImportedStudentsDisplayed] = useState<StudentsImportData[]>([])

    const [loadingImport, setLoadingImport] = useState<boolean>(false)
    const [importInfo, setImportInfo] = useState<ImportInfo | undefined>(undefined)
    
    const [displayPage, setDisplayPage] = useState<DisplayPage>(DisplayPage.AddCSV)


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
            setImportedStudentsDisplayed(students)
            setPageImport({
                current: 0,
                size: DEFAULT_PAGE_SIZE,
                total: students.length
            })
            setLoadingImport(false)
        }
        reader.readAsText(file)
        setDisplayPage(DisplayPage.StudentTable)
        return false
    }, [])

    const uploadImages = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        
        if (!event.target.files || event.target.files.length === 0) return

        const importedStudentsWithFile: StudentsImportData[] = []
        Array.from(event.target.files).forEach(file => {
            const id = file.name.split(".")[0]
            const studentWithFileImported = importedStudents.find((i: StudentsImportData) => i.student.id.toString() === id)

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
        const result: StudentsImportData[] = []
        csv.split("\n").forEach(line => {
            if (line.length !== 0) {
                const column = line.split(",")
                result.push({
                    student: {
                        id: +column[0],
                        firstName: column[1],
                        lastName: column[2],
                        promo: +column[3],
                        feedId: undefined!,
                    }
                })
            }
        })
        return result
    }

    const uploadStudents = useCallback(async () =>  {
        setDisplayPage(DisplayPage.Importing)

        const initImportData:ImportInfo = { 
            currentImported:0, 
            totalImport: importedStudents.length, 
            lastStudent: {
                firstName: "", 
                lastName: "", 
                id: 0, 
                promo: 0,
                feedId: undefined!,
            },
            blobStudent: undefined
        }

        setImportInfo(initImportData)

        //Import students 5 by 5

        for(let x = 0;x<importedStudents.length/5;x++){
            const uploadStudents = importedStudents.slice(x*5, (x+1)*5)
            await importStudents(uploadStudents)

            const updateImportData:ImportInfo = { 
                currentImported: x*5 + uploadStudents.length,
                totalImport: importedStudents.length, 
                lastStudent: importedStudents[x*5].student,
                blobStudent: importedStudents[x*5].file
            }

            setImportInfo(updateImportData)
        }


    }, [importedStudents])

    const reset = useCallback(() => {
        setImportedStudents([])
        setImportedStudentsDisplayed([])
        setDisplayPage(DisplayPage.AddCSV)
    }, [])


    const handleSearchStudent = (e:ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        
        if(val == ""){
            setImportedStudentsDisplayed(importedStudents)
        } else {
            setImportedStudentsDisplayed(importedStudents.filter(s => ((s.student.firstName + s.student.lastName).toLocaleLowerCase() + s.student.id.toString() + s.student.promo.toString()).includes(val.toLocaleLowerCase().replaceAll(" ", ""))))
        }

        setPageImport({
            current: 0,
            size: pageImport.size,
            total: importedStudentsDisplayed.length
        })
    }

    return (
        <div>
            <div className={`flex flex-col items-center ${displayPage == DisplayPage.AddCSV ? "block" : "hidden"}`}>
                <h3 className="font-bold text-gray-700">Information :</h3>
                <p className="text-gray-700 text-center">
                    le fichier doit être un CSV (séparation virgule) suivant le pattern : <br/>
                    <strong>numéro étudiant, prénom, nom, année de promotion</strong>
                </p>
                <Upload name="csv" beforeUpload={uploadCSVFile} multiple={false} accept=".csv" showUploadList={false}>
                    <Button icon={<FontAwesomeIcon icon={faUpload}/>} className="rounded space-x-2">Importer des étudiants</Button>
                </Upload>
            </div>
            <div className={`${displayPage == DisplayPage.StudentTable ? "block" : "hidden"} mb-4 px-4`}>
                <div className=" flex justify-center">
                    <label
                        className=" bg-indigo-500 text-white rounded cursor-pointer py-1 px-2 hover:shadow-md hover:bg-opacity-75 transition ease-in duration-200">
                        <input
                            type="file"
                            multiple={true}
                            accept="image/jpeg, image/png, image/gif, image/bmp"
                            className="overflow-hidden absolute opacity-0 z-0 w-1 h-1 "
                            onChange={uploadImages}
                        />
                        Importer les images
                    </label>


                    <Button
                        type="primary"
                        className="shadow-md mx-4 rounded"
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
                        Réinitialiser
                    </Button>
                </div>
                
                <Input 
                    className="flex w-full sm:w-1/2 mx-auto mt-8 mb-2"
                    addonBefore={<FontAwesomeIcon icon={faSearch} />}
                    placeholder="Rechercher par prénom, nom, numéro étudiant, promotion..."
                    onChange={handleSearchStudent}
                />

                <div className="w-full sm:w-1/2 mx-auto mb-8">
                    <ul>
                        <li><span className="font-semibold">Nombre d'étudiants à importer :</span> {importedStudents.length}</li>
                        <li><span className="font-semibold">Nombre d'étudiants affichés :</span> {importedStudentsDisplayed.length}</li>
                    </ul>
                </div>
            </div>

           

            <Table
                className={`${displayPage == DisplayPage.StudentTable ? "block" : "hidden"} w-min mx-auto`}
                columns={importTableConfig}
                data={importedStudentsDisplayed.slice(
                    (pageImport.current)* (pageImport.size || DEFAULT_PAGE_SIZE), (pageImport.current +1) * (pageImport.size || DEFAULT_PAGE_SIZE)
                )}
                loading={loadingImport}
                page={pageImport}
                onPageChange={(page) => setPageImport(prevState => ({...prevState, current: page-1}))}
                onSizeChange={(current, size) => setPageImport(p => ({...p, size}))}
                row={TableImportRow}
            />

            <div className={`${displayPage == DisplayPage.Importing ? "block" : "hidden"}  mb-4 mx-auto w-1/2 bg-white shadow rounded-lg p-6 sticky`}>
                <div className={`${importInfo?.currentImported != importInfo?.totalImport ? "block" : "hidden"} flex flex-col justify-center items-center`}>
                    <h3 className="text-lg">Importation en cours</h3>
                    <div className="w-full text-center mt-6 mb-4">
                        <ImportedAvatar file={importInfo?.blobStudent} large/>
                    </div>

                    <p className="text-md">{importInfo?.lastStudent.lastName.toUpperCase() + " " + importInfo?.lastStudent.firstName}</p>
                    <p className="mt-8">{ importInfo?.currentImported} / {importInfo?.totalImport}</p>
                    <div className="relative pt-1 w-full">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                            <div style={{"width" : (importInfo?.currentImported ?? 0)/(importInfo?.totalImport ?? 1)*100 + "%"}} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                        </div>
                    </div>
                </div>
                <div className={`${importInfo?.currentImported == importInfo?.totalImport ? "block" : "hidden"} flex flex-col justify-center items-center`}>
                    <h3 className="text-lg">Importation terminée !</h3>
                    <FontAwesomeIcon icon={faCheckCircle} className="mt-2 text-green-500" size="4x"/>
                    <Button
                        type="primary"
                        className="shadow-md py-1 px-2 text-white rounded border-yellow-500 bg-yellow-500 mt-8"
                        onClick={reset}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="pr-2" size="lg"/>
                        Retour
                    </Button>
                    
                </div>
            </div>
        </div>
    )
}

const TableImportRow: React.FC<RowProps<StudentsImportData>> = ({data: {student, file}}) => (
    <tr key={student.id}>
        <td className="px-6 py-1 whitespace-no-wrap border-b border-gray-200">
            <ImportedAvatar file={file}/>
        </td>
        <td className="px-6 font-semibold text-gray-900 border-b border-gray-200 whitespace-no-wrap">{student.firstName}</td>
        <td className="px-6 font-semibold text-gray-900 border-b border-gray-200 whitespace-no-wrap">{student.lastName}</td>
        <td className="px-6 border-b border-gray-200 whitespace-no-wrap">n°{student.id}</td>
        <td className="px-6 border-b border-gray-200 whitespace-no-wrap">{student.promo}</td>
    </tr>
)

export default StudentsImport
