import {AxiosPromise} from "axios"
import {
    Club,
    ClubAdminForm,
    ClubForm,
    ClubMember,
    ClubMemberCreationForm,
    ClubMemberUpdateForm,
    ClubPreview
} from "./types"
import {StudentPreview} from "../student/types"
import {Page} from "../request.type"
import {GalleryPreview} from "../gallery/types"
import {apiClient} from "../http"


export const getAllClubs = (): AxiosPromise<ClubPreview[]> => apiClient.get("/club")

export const getClub = (id: number): AxiosPromise<Club> => apiClient.get(`/club/${id}`, {})

export const createClub = (form: ClubAdminForm): AxiosPromise<Club> => apiClient.post("/club", form)

export const updateClubAdmin = (id: number, form: ClubAdminForm): AxiosPromise<Club> => apiClient.put(`/club/${id}/admin`, form)

export const updateClub = (id: number, form: ClubForm): AxiosPromise<Club> => apiClient.put(`/club/${id}`, form)

export const toggleClubArchiveStatus = (id: number): AxiosPromise<boolean> => apiClient.put(`/club/${id}/archive`)

export const uploadClubLogo = (id: number, file: File | null): AxiosPromise<string> => {
    const fd = new FormData()
    fd.append("file", file as Blob)

    return apiClient.post(`/club/${id}/logo`, fd)
}

export const uploadCover = (id: number, file: File | null): AxiosPromise<string> => {
    const fd = new FormData()
    fd.append("file", file as Blob)

    return apiClient.put(`/club/${id}/cover`, fd)
}

export const deleteClub = (id: number): AxiosPromise<void> => apiClient.delete(`/club/${id}`)

export const getClubAdmins = (id: number): AxiosPromise<StudentPreview[]> => apiClient.get(`/club/${id}/admins`)

export const getClubSchoolSessions = (id: number): AxiosPromise<number[]> => apiClient.get(`/club/${id}/school-sessions`)

export const getMembers = (id: number, year ?: number): AxiosPromise<ClubMember[]> => apiClient.get(`/club/${id}/member`, {
    params: {y: year}
})

export const getClubGalleries = (id: number): AxiosPromise<Page<GalleryPreview>> => apiClient.get(`/club/${id}/galleries`)

export const addClubMember = (id: number, member: ClubMemberCreationForm): AxiosPromise<ClubMember> => apiClient.post(`club/${id}/member`, member)

export const updateClubMember = (member: number, form: ClubMemberUpdateForm): AxiosPromise<ClubMember> => apiClient.put(`club/member/${member}`, form)

export const deleteClubMember = (member: number): AxiosPromise<ClubMember> => apiClient.delete(`club/member/${member}`)
