import axios, {AxiosPromise} from "axios"
import {Club, ClubForm, ClubPreview} from "./types"
import {StudentPreview} from "../student/types"


export const getAllClubs = (): AxiosPromise<ClubPreview[]> => {
	return axios.get("/club")
}

export const getClub = (id: number): AxiosPromise<Club> => {
	return axios.get(`/club/${id}`, {})
}

export const createClub = (form: ClubForm): AxiosPromise<Club> => {
	return axios.post("/club", form)
}

export const updateClub = (id: number, form: ClubForm): AxiosPromise<Club> => {
	return axios.put(`/club/${id}`, form)
}

export const toggleClubArchiveStatus = (id: number): AxiosPromise<boolean> => {
	return axios.put(`/club/${id}/archive`)
}

export const uploadLogo = (id: number, file: File): AxiosPromise<string> => {
	const fd = new FormData()
	fd.append("file", file as Blob)

	return axios.put(`/club/${id}/logo`, fd)
}

export const deleteClub = (id: number): AxiosPromise<void> => {
	return axios.delete(`/club/${id}`)
}


export const getClubAdmins = (id: number): AxiosPromise<StudentPreview[]> => {
	return axios.get(`/club/${id}/admins`)
}
