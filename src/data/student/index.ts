import {AxiosPromise} from "axios"
import {
    Student,
    StudentAdminForm,
    StudentAdmin,
    StudentPreview,
    StudentPreviewAdmin, StudentSettings, StudentPicture, StudentOverview, StudentsImportData, LoggedStudentPreview
} from "./types"
import {ClubMemberPreview} from "../club/types"
import {Page} from "../request.type"
import {SearchItem} from "../searchbar/types"
import {apiClient} from "../http"

export const getLoggedUser = (): AxiosPromise<LoggedStudentPreview> => apiClient.get("/student/me")

export const getCompleteLoggedUser = (): AxiosPromise<Student> => apiClient.get("/student/me/full")

export const updateSettings = (settings: Partial<StudentSettings>): AxiosPromise<Student> => apiClient.patch("/student/me/setting", settings)

export const updateCustomPicture = (image: File | null): AxiosPromise<StudentPicture> => {
    const fd = new FormData()
    fd.append("file", image as Blob)

    return apiClient.post("/student/me/picture", fd)
}

export const deleteCustomPicture = (student: number): AxiosPromise<StudentPicture> => apiClient.delete(`/student/${student}/admin/picture/custom`)


export const updateOriginalPicture = (id: number, image?: File): AxiosPromise<StudentPicture> => {
    const fd = new FormData()
    fd.append("file", image as Blob)

    return apiClient.put(`/student/${id}/admin/picture/original`, fd)
}


export const getStudent = (id: number): AxiosPromise<StudentOverview> => apiClient.get(`/student/${id}`)

export const getStudentAdmin = (id: number): AxiosPromise<StudentAdmin> => apiClient.get(`/student/${id}/admin`)

export const searchStudentsPaged = (page: number, name?: string, promos?: string, atoz?: boolean): AxiosPromise<Page<SearchItem>> => apiClient.get("/search/student/", {
    params: {
        page,
        name,
        promos,
        atoz
    }
})

export const searchAllStudents = (name: string): AxiosPromise<SearchItem[]> => apiClient.get("/search/student/all", {params: {name}})

export const getStudentClubs = (studentId: number): AxiosPromise<SearchItem> => apiClient.get(`/student/${studentId}/club`)

export const searchStudents = (page: number, name?: string, promos?: string, atoz?: boolean): AxiosPromise<Page<SearchItem>> => apiClient.get("/search/student", {params: {page, name, promos, atoz}})

export const updateLoggedStudent = (id: number): AxiosPromise<Student> => apiClient.put(`/student/${id}`)

export const getAllPromo = (): AxiosPromise<number[]> => apiClient.get("/student/promos")

export const getAllStudents = (page = 0): AxiosPromise<Page<StudentPreview>> => apiClient.get("/student", {params: {page}})

export const getAllStudentsAdmin = (page = 0): AxiosPromise<Page<StudentPreviewAdmin>> => apiClient.get("/student/admin", {params: {page}})

export const createStudent = (form: StudentAdminForm): AxiosPromise<StudentAdmin> => apiClient.post("/student", form)

export const updateStudentAdmin = (form: StudentAdminForm): AxiosPromise<StudentAdmin> => apiClient.put("/student/admin", form)

export const toggleStudentArchiveStatus = (id: number): AxiosPromise<boolean> => apiClient.put(`/student/${id}/archive`)


export const deleteStudent = (id: number): AxiosPromise<void> => apiClient.delete(`/student/${id}`)


export const getClubsForStudent = (id: number): AxiosPromise<ClubMemberPreview[]> => apiClient.get(`/student/${id}/club`)

export const importStudent = (student: StudentPreview, file: Blob | undefined): AxiosPromise => {
    const fd = new FormData()
    fd.append("firstName", student.firstName)
    fd.append("lastName", student.lastName)
    fd.append("id", student.id.toString())
    fd.append("promo", student.promo.toString())
    if (file)
        fd.append("file", file)
    return apiClient.post("/student/import", fd)
}

export const importStudents = (students: StudentsImportData[]): AxiosPromise => {
    const fd = new FormData()
    for(const student of students){
        fd.append("firstName[]", student.student.firstName)
        fd.append("lastName[]", student.student.lastName)
        fd.append("id[]", student.student.id.toString())
        fd.append("promo[]", student.student.promo.toString())
        fd.append("hasFile[]", (!!student.file).toString())
        if(student.file)
            fd.append("file[]", student.file)
    }

    return apiClient.post("/student/import/multiple", fd)
}
