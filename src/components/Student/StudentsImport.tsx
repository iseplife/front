import React, {useCallback, useState} from "react"
import {Button, message, Upload, Input} from "antd"
import Table, {RowProps} from "../Common/TableAdmin"
import {PageStatus} from "../../pages/admin/student"
import {StudentPreview, StudentsImportPicture} from "../../data/student/types"
import {importStudents, importStudentsPicture} from "../../data/student"
import ImportedAvatar from "../Common/ImportedAvatar"
import {RcFile} from "antd/es/upload"
import {faArrowLeft, faCheck, faSearch, faSyncAlt, faTimes, faUpload} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons"

const importTableConfig = [
    {title: "Prénom", dataIndex: "firstName", className: "w-32"},
    {title: "Nom", dataIndex: "lastName", className: "w-32"},
    {title: "N°étudiant", dataIndex: "id", className: "w-32"},
    {title: "Promotion", dataIndex: "promo", className: "w-32"}
]

enum DisplayPage {
    AddCSV,
    StudentTable,
    Importing,
    ImageStudent
  }

const DEFAULT_PAGE_SIZE = 10
const StudentsImport: React.FC = () => {
    const [pageImport, setPageImport] = useState<PageStatus>({current: 0, size: DEFAULT_PAGE_SIZE})

    const [loadingCSV, setLoadingCSV] = useState<boolean>(false)

    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)
    const [uploadingStudents, setUploadingStudents] = useState<boolean>(false)
    const [importStudentsList, setImportStudentsList] = useState<StudentPreview[]>([])
    const [importedStudentsDisplayed, setImportedStudentsDisplayed] = useState<StudentPreview[]>([])

    const [uploadingStudentsPictures, setUploadingStudentsPictures] = useState<boolean>(false)
    const [importStudentsPictureList, setImportStudentsPictureList] = useState<StudentsImportPicture[]>([])


    const [uploadingDataIndex, setUploadingDataIndex] = useState<number>(0)
    
    const [displayPage, setDisplayPage] = useState<DisplayPage>(DisplayPage.AddCSV)


    const uploadCSVFile = useCallback((file: RcFile) => {
        setLoadingCSV(true)
        const csvFile = file.type === "text/csv" || file.type === "application/vnd.ms-excel"
        if (!csvFile) {
            message.error("You can only upload CSV File")
        }
        const reader = new FileReader()
        reader.onload = () => {
            const text = reader.result as string
            const students = readCSVToObject(text)
            setImportStudentsList(students)
            setImportedStudentsDisplayed(students)
            setPageImport({
                current: 0,
                size: DEFAULT_PAGE_SIZE,
                total: students.length
            })
            setLoadingCSV(false)
        }
        reader.readAsText(file)
        setDisplayPage(DisplayPage.StudentTable)
        return false
    }, [])

    
    const readCSVToObject = (csv: string) => {
        const result: StudentPreview[] = []
        csv.split("\n").forEach(line => {
            if (line.length !== 0) {
                const column = line.split(",")
                result.push({
                    id: +column[0],
                    firstName: column[1],
                    lastName: column[2],
                    promo: +column[3],
                })
            }
        })
        return result
    }

    const selectImages = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        
        if (!event.target.files || event.target.files.length === 0) return

        setUploadingStudents(true)

        const imageImported: StudentsImportPicture[] = []
        Array.from(event.target.files).forEach(file => {
            const id = +file.name.split(".")[0]
            imageImported.push({id, file})
        })

        setImportStudentsPictureList(imageImported)
        setDisplayPage(DisplayPage.ImageStudent)

        event.target.value = ""

    }, [])

    const uploadStudents = useCallback(async () =>  {

        setDisplayPage(DisplayPage.Importing)
        setUploadingStudents(true)
        setUploadingStudentsPictures(false)
        setUploadSuccess(true)
        setUploadingDataIndex(0)

        const stepSize = 10
        const maxSteps = Math.ceil(importStudentsList.length/stepSize)+1
        let index = 0

        try {
            for(let x = 0;x<maxSteps;x++){       
                const uploadStudents = importStudentsList.slice(index, (index+1)+stepSize < importStudentsList.length ? (index+1)+stepSize : importStudentsList.length)
                if(uploadStudents.length == 0) break
                await importStudents(uploadStudents)
                index+=stepSize
                setUploadingDataIndex(index)
            }
            setUploadSuccess(true)
        } catch (e) {
            setUploadSuccess(false)
        }
       
        setUploadingStudents(false)

    }, [importStudentsList])

    const uploadStudentsPicture = useCallback(async () =>  {

        setDisplayPage(DisplayPage.Importing)
        setUploadingStudents(false)
        setUploadingStudentsPictures(true)
        setUploadSuccess(true)
        setUploadingDataIndex(0)

        const stepSize = 5
        const maxSteps = Math.ceil(importStudentsPictureList.length/stepSize)+1
        let index = 0

        try {
            for(let x = 0;x<maxSteps;x++){       
                const uploadStudentsPicture = importStudentsPictureList.slice(index, (index+1)+stepSize < importStudentsPictureList.length ? (index+1)+stepSize : importStudentsPictureList.length)
                if(uploadStudentsPicture.length == 0) break
                await importStudentsPicture(uploadStudentsPicture)
                index+=stepSize
                setUploadingDataIndex(index)
            }
            setUploadSuccess(true)
        } catch (e) {
            setUploadSuccess(false)
        }
       
        setUploadingStudentsPictures(false)

    }, [importStudentsPictureList])

    const reset = useCallback(() => {
        setImportStudentsList([])
        setImportStudentsPictureList([])
        setImportedStudentsDisplayed([])
        setDisplayPage(DisplayPage.AddCSV)
    }, [])


    const handleSearchStudent = (e:React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        
        if(val == ""){
            setImportedStudentsDisplayed(importStudentsList)
        } else {
            setImportedStudentsDisplayed(importStudentsList.filter(s => ((s.firstName + s.lastName).toLocaleLowerCase() + s.id.toString() + s.promo.toString()).includes(val.toLocaleLowerCase().replaceAll(" ", ""))))
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

                <div className="flex space-x-4">
                    <Upload name="csv" beforeUpload={uploadCSVFile} multiple={false} accept=".csv" showUploadList={false}>
                        <Button icon={<FontAwesomeIcon icon={faUpload}/>} className="rounded space-x-2">Importer des étudiants</Button>
                    </Upload>
                    <label
                        className=" bg-[#e87a05] text-white rounded cursor-pointer py-1 px-2 hover:shadow-md hover:bg-opacity-75 transition ease-in duration-200">
                        <input
                            type="file"
                            multiple={true}
                            accept="image/jpeg, image/png, image/gif, image/bmp"
                            className="overflow-hidden absolute opacity-0 z-0 w-1 h-1 "
                            onChange={selectImages}
                        />
                        Importer les images
                    </label>
                </div>
               
            </div>
            <div className={`${displayPage == DisplayPage.StudentTable ? "block" : "hidden"} mb-4 px-4`}>
                <div className=" flex justify-center">

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
                        <li><span className="font-semibold">Nombre d'étudiants à importer :</span> {importStudentsList.length}</li>
                        <li><span className="font-semibold">Nombre d'étudiants affichés :</span> {importedStudentsDisplayed.length}</li>
                    </ul>
                </div>
            </div>

            { displayPage == DisplayPage.StudentTable && 
            <Table
                className="w-min mx-auto"
                columns={importTableConfig}
                data={importedStudentsDisplayed.slice(
                    (pageImport.current)* (pageImport.size || DEFAULT_PAGE_SIZE), (pageImport.current +1) * (pageImport.size || DEFAULT_PAGE_SIZE)
                )}
                loading={loadingCSV}
                page={pageImport}
                onPageChange={(page) => setPageImport(prevState => ({...prevState, current: page-1}))}
                onSizeChange={(current, size) => setPageImport(p => ({...p, size}))}
                row={TableImportRow}
            /> }

            { displayPage == DisplayPage.ImageStudent &&
            <div className="mb-4 mx-auto w-1/2 bg-white shadow rounded-lg p-6 sticky">
                <p>Importer {importStudentsPictureList.length} images.</p>
                <div className="flex justify-between mt-4">
                    <button className="bg-[#e87a05] text-white rounded cursor-pointer py-1 px-2 hover:shadow-md hover:bg-opacity-75 transition ease-in duration-200" onClick={reset}>Retour</button>
                    <button className="bg-[#e87a05] text-white rounded cursor-pointer py-1 px-2 hover:shadow-md hover:bg-opacity-75 transition ease-in duration-200" onClick={uploadStudentsPicture}>Enregistrer</button>
                </div>
            </div>
            }

            { displayPage == DisplayPage.Importing && 
                <div className="mb-4 mx-auto w-1/2 bg-white shadow rounded-lg p-6 sticky">
                    { uploadingStudents && <div>
                        <p>Importation des étudiants en cours...</p>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 ">
                            <div className="bg-blue-600 h-2.5 rounded-full duration-200" style={{width : uploadingDataIndex/importStudentsList.length*100 + "%" }}></div>
                        </div>
                    </div>}

                    
                    { uploadingStudentsPictures && <div>                     
                        <p>Importation des photos de profil en cours...</p>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 ">
                            <div className="bg-blue-600 h-2.5 rounded-full duration-200" style={{width : uploadingDataIndex/importStudentsPictureList.length*100 + "%" }}></div>
                        </div>
                    </div>}

                    { !uploadingStudentsPictures && !uploadingStudents && uploadSuccess && <div className="flex items-center space-x-2">

                        <div className="w-full flex items-center">
                            <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-2"/>
                            <p className="text-green-600 m-0">Importation réussie.</p>
                        </div>

                        <div className="text-right mt-4">
                            <button className="bg-[#e87a05] text-white rounded cursor-pointer py-1 px-2 hover:shadow-md hover:bg-opacity-75 transition ease-in duration-200" onClick={reset}>Retour</button>
                        </div>
                    </div> }

                    { !uploadingStudentsPictures && !uploadingStudents && !uploadSuccess && <div className="">
                        <div className="w-full flex items-center">
                            <FontAwesomeIcon icon={faTimes} className="text-red-600 mr-2"/>
                            <p className="text-red-600 m-0">Une erreur est survenue.</p>
                        </div>

                        <div className="text-right mt-4">
                            <button className="bg-[#e87a05] text-white rounded cursor-pointer py-1 px-2 hover:shadow-md hover:bg-opacity-75 transition ease-in duration-200" onClick={reset}>Retour</button>
                        </div>
                    </div> }
                
                </div>
            }
        </div>
    )
}

const TableImportRow: React.FC<RowProps<StudentPreview>> = ({data: {firstName, lastName, id, promo}}) => (
    <tr key={id}>
        <td className="px-6 font-semibold text-gray-900 border-b border-gray-200 whitespace-no-wrap">{firstName}</td>
        <td className="px-6 font-semibold text-gray-900 border-b border-gray-200 whitespace-no-wrap">{lastName}</td>
        <td className="px-6 border-b border-gray-200 whitespace-no-wrap">n°{id}</td>
        <td className="px-6 border-b border-gray-200 whitespace-no-wrap">{promo}</td>
    </tr>
)

export default StudentsImport
