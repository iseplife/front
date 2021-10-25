import {AxiosPromise} from "axios"
import {Page} from "../request.type"
import {Group, GroupAdmin, GroupForm, GroupMember, GroupPreview} from "./types"
import {apiClient} from "../http"
import {MediaName} from "../media/types"

export const getAllGroup = (page = 0): AxiosPromise<Page<GroupPreview>> =>
    apiClient.get("/group", {
        params: {page}
    })

export const getUserGroups = (): AxiosPromise<GroupPreview[]> => apiClient.get("/group/me")

export const getGroup = (id: number): AxiosPromise<Group> => apiClient.get(`/group/${id}`)

export const getGroupAdmin = (id: number): AxiosPromise<GroupAdmin> => apiClient.get(`/group/${id}/admin`)

export const deleteGroup = (id: number): AxiosPromise<void> => apiClient.delete(`/group/${id}`)

export const toggleGroupArchiveStatus = (id: number): AxiosPromise<boolean> => apiClient.put(`/group/${id}/archive`)

export const createGroup = (form: GroupForm): AxiosPromise<GroupAdmin> => apiClient.post("/group", form)

export const updateGroup = (id: number, form: GroupForm): AxiosPromise<GroupAdmin> => apiClient.put(`/group/${id}`, form)

export const uploadGroupCover = (id: number, file: File | null): AxiosPromise<MediaName> => {
    const fd = new FormData()
    fd.append("file", file as Blob)

    return apiClient.put(`/group/${id}/cover`, fd)
}

export const getGroupMembers = (group: number): AxiosPromise<GroupMember[]> => apiClient.get(`/group/${group}/member`)

export const addGroupMember = (group: number, studentId: number): AxiosPromise<GroupMember> => apiClient.post(`/group/${group}/member/`, {studentId })

export const deleteGroupMember = (group: number, member: number): AxiosPromise<boolean> => apiClient.delete(`/group/${group}/member/${member}`)

export const promoteGroupMember = (group: number, member: number): AxiosPromise<boolean> => apiClient.post(`/group/${group}/member/${member}/promote`)

export const demoteGroupMember = (group: number, member: number): AxiosPromise<boolean> => apiClient.post(`/group/${group}/member/${member}/demote`)



