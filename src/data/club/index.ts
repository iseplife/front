import axios, {AxiosPromise} from "axios"
import {Club, ClubAdminForm, ClubMember, ClubPreview} from "./types"
import {StudentPreview} from "../student/types"
import {Page} from "../request.type"
import {Gallery} from "../gallery/types"


export const getAllClubs = (): AxiosPromise<ClubPreview[]> => axios.get("/club")

export const getClub = (id: number): AxiosPromise<Club> => axios.get(`/club/${id}`, {})

export const createClub = (form: ClubAdminForm): AxiosPromise<Club> => axios.post("/club", form)

export const updateClub = (id: number, form: ClubAdminForm): AxiosPromise<Club> => axios.put(`/club/${id}`, form)

export const toggleClubArchiveStatus = (id: number): AxiosPromise<boolean> => axios.put(`/club/${id}/archive`)

export const uploadLogo = (id: number, file: File): AxiosPromise<string> => {
    const fd = new FormData()
    fd.append("file", file as Blob)

    return axios.put(`/club/${id}/logo`, fd)
}

export const uploadCover = (id: number, file: File | null): AxiosPromise<string> => {
    const fd = new FormData()
    fd.append("file", file as Blob)

    return axios.put(`/club/${id}/cover`, fd)
}

export const deleteClub = (id: number): AxiosPromise<void> => axios.delete(`/club/${id}`)

export const getClubAdmins = (id: number): AxiosPromise<StudentPreview[]> => axios.get(`/club/${id}/admins`)

export const getClubMembers = (id: number): AxiosPromise<ClubMember[]> => axios.get(`/club/${id}/member`)

export const getClubGalleries = (id: number): AxiosPromise<Page<Gallery>> => axios.get(`/club/${id}/galleries`)

export const addClubMember = (id: number, student: number): AxiosPromise<ClubMember> => axios.put(`club/${id}/member/${student}`)