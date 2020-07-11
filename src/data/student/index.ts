import axios, {AxiosPromise} from "axios"
import {
	Student,
	StudentAdminForm,
	StudentAdmin,
	StudentPreview,
	StudentPreviewAdmin
} from "./types"
import {ClubMemberView} from "../club/types"
import {Page} from "../request.type"
import {SearchItem} from "../searchbar/types"

export const getLoggedUser = (): AxiosPromise<Student> => axios.get("/student/me")

export const getStudent = (id: number): AxiosPromise<Student> => axios.get(`/student/${id}`)

export const getStudentAdmin = (id: number): AxiosPromise<StudentAdmin> => axios.get(`/student/${id}/admin`)

export const searchStudentsPaged = (page: number, name?: string, promos?: string, atoz?: boolean): AxiosPromise<Page<SearchItem>> => axios.get("/search/student/", {
	params: {
		page,
		name,
		promos,
		atoz
	}
})

export const searchStudents = (name: string): AxiosPromise<SearchItem[]> => axios.get("/search/student/all", {params: {name}})

export const getAllStudents = (page = 0): AxiosPromise<Page<StudentPreview>> => axios.get("/student", {params: {page}})

export const getAllStudentsAdmin = (page = 0): AxiosPromise<Page<StudentPreviewAdmin>> => axios.get("/student/admin", {params: {page}})

export const createStudent = (student: StudentAdminForm): AxiosPromise<StudentAdmin> => {
	const fd = new FormData()
	fd.append("file", student.picture as Blob)

	delete student.picture
	delete student.resetPicture
	fd.append("form", JSON.stringify(student))

	return axios.post("/student", fd)
}

export const updateLoggedStudent = (id: number): AxiosPromise<Student> => axios.put(`/student/${id}`)

export const updateStudentAdmin = (form: StudentAdminForm): AxiosPromise<StudentAdmin> => {
	const fd = new FormData()
	fd.append("file", form.picture as Blob)

	delete form.picture
	fd.append("form", JSON.stringify(form))

	return axios.put("/student/admin", fd)
}

export const toggleStudentArchiveStatus = (id: number): AxiosPromise<boolean> => axios.put(`/student/${id}/archive`)


export const deleteStudent = (id: number): AxiosPromise<void> => axios.delete(`/student/${id}`)


export const getClubsForStudent = (studentId: number): AxiosPromise<ClubMemberView[]> => axios.get(`/student/${studentId}/club`)