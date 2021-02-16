import axios, {AxiosPromise} from "axios"
import {Page} from "../request.type"
import {Group, GroupAdmin, GroupForm, GroupMember, GroupPreview} from "./types"

export const getAllGroup = (page = 0): AxiosPromise<Page<GroupPreview>> =>
    axios.get("/group", {
        params: {page}
    })

export const getUserGroups = (): AxiosPromise<GroupPreview[]> => axios.get("/group/me")

export const getGroup = (id: number): AxiosPromise<Group> => axios.get(`/group/${id}`)

export const getGroupAdmin = (id: number): AxiosPromise<GroupAdmin> => axios.get(`/group/${id}/admin`)

export const deleteGroup = (id: number): AxiosPromise<void> => axios.delete(`/group/${id}`)

export const toggleGroupArchiveStatus = (id: number): AxiosPromise<boolean> => axios.put(`/group/${id}/archive`)

export const createGroup = (form: GroupForm): AxiosPromise<GroupAdmin> => axios.post("/group", form)

export const updateGroup = (id: number, form: GroupForm): AxiosPromise<GroupAdmin> => axios.put(`/group/${id}`, form)

export const uploadGroupCover = (id: number, file: File | null): AxiosPromise<string> => {
    const fd = new FormData()
    fd.append("file", file as Blob)

    return axios.post(`/group/${id}/cover`, fd)
}

export const getGroupMembers = (group: number): AxiosPromise<GroupMember[]> => axios.get(`/group/${group}/member`)

export const addGroupMember = (group: number, studentId: number): AxiosPromise<GroupMember> => axios.post(`/group/${group}/member/`, {studentId })

export const deleteGroupMember = (group: number, member: number): AxiosPromise<boolean> => axios.delete(`/group/${group}/member/${member}`)

export const promoteGroupMember = (group: number, member: number): AxiosPromise<boolean> => axios.post(`/group/${group}/member/${member}/promote`)

export const demoteGroupMember = (group: number, member: number): AxiosPromise<boolean> => axios.post(`/group/${group}/member/${member}/demote`)



