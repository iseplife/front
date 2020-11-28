import axios, {AxiosPromise} from "axios"
import {
    Student,
    StudentAdminForm,
    StudentAdmin,
    StudentPreview,
    StudentPreviewAdmin, StudentSettings, StudentPicture, StudentOverview
} from "./types"
import {ClubMemberPreview} from "../club/types"
import {Page} from "../request.type"
import {SearchItem} from "../searchbar/types"

export const getLoggedUser = (): AxiosPromise<StudentPreview> => axios.get("/student/me")

export const getCompleteLoggedUser = (): AxiosPromise<Student> => axios.get("/student/me/full")

export const updateSettings = (settings: Partial<StudentSettings>): AxiosPromise<Student> => axios.patch("/student/me/setting", settings)

export const updateCustomPicture = (image: File | null): AxiosPromise<StudentPicture> => axios.put("/student/me/picture", image)

export const updateOriginalPicture = (id: number, image: File): AxiosPromise<StudentPicture> => axios.put(`/student/${id}/picture/original`, image)


export const getStudent = (id: number): AxiosPromise<StudentOverview> => axios.get(`/student/${id}`)

export const getStudentAdmin = (id: number): AxiosPromise<StudentAdmin> => axios.get(`/student/${id}/admin`)

export const searchStudentsPaged = (page: number, name?: string, promos?: string, atoz?: boolean): AxiosPromise<Page<SearchItem>> => axios.get("/search/student/", {
    params: {
        page,
        name,
        promos,
        atoz
    }
})

export const searchAllStudents = (name: string): AxiosPromise<SearchItem[]> => axios.get("/search/student/all", {params: {name}})

export const getStudentClubs = (studentId: number): AxiosPromise<SearchItem> => axios.get(`/student/${studentId}/club`)

export const searchStudents = (page: number, name?: string, promos?: string, atoz?: boolean): AxiosPromise<Page<SearchItem>> => axios.get("/search/student", {params: {page, name, promos, atoz}})

export const updateLoggedStudent = (id: number): AxiosPromise<Student> => axios.put(`/student/${id}`)

export const getAllPromo = (): AxiosPromise<number[]> => axios.get("/student/promos")

export const getAllStudents = (page = 0): AxiosPromise<Page<StudentPreview>> => axios.get("/student", {params: {page}})

export const getAllStudentsAdmin = (page = 0): AxiosPromise<Page<StudentPreviewAdmin>> => axios.get("/student/admin", {params: {page}})

export const createStudent = (form: StudentAdminForm): AxiosPromise<StudentAdmin> => axios.post("/student", form)

export const updateStudentAdmin = (form: StudentAdminForm): AxiosPromise<StudentAdmin> => axios.put("/student/admin", form)


export const toggleStudentArchiveStatus = (id: number): AxiosPromise<boolean> => axios.put(`/student/${id}/archive`)


export const deleteStudent = (id: number): AxiosPromise<void> => axios.delete(`/student/${id}`)


export const getClubsForStudent = (id: number): AxiosPromise<ClubMemberPreview[]> => axios.get(`/student/${id}/club`)

export const importStudent = (student: StudentPreview, file: Blob | undefined): AxiosPromise => {
    const fd = new FormData()
    fd.append("firstName", student.firstName)
    fd.append("lastName", student.lastName)
    fd.append("id", student.id.toString())
    fd.append("promo", student.promo.toString())
    if (file)
        fd.append("file", file)
    return axios.post("/student/import", fd)
}