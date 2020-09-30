import axios, {AxiosPromise} from "axios"
import {Page} from "../request.type"
import {Group, GroupForm, GroupPreview} from "./types"

export const getAllGroup = (page = 0): AxiosPromise<Page<Group>> =>
    axios.get("/group", {
        params: {page}
    })

export const getUserGroups = (): AxiosPromise<GroupPreview[]> => axios.get("/group/me")

export const getGroup = (id: number): AxiosPromise<Group> => axios.get(`/group/${id}`)

export const deleteGroup = (id: number): AxiosPromise<void> => axios.delete(`/group/${id}`)

export const toggleGroupArchiveStatus = (id: number): AxiosPromise<boolean> => axios.put(`/group/${id}/archive`)

export const createGroup = (form: GroupForm): AxiosPromise<Group> => axios.post("/group", form)

export const updateGroup = (id: number, form: GroupForm): AxiosPromise<Group> => axios.put(`/group/${id}`, form)

export const uploadGroupCover = (id: number, file: File | null): AxiosPromise<string> => {
    const fd = new FormData()
    fd.append("file", file as Blob)

    return axios.post(`/group/${id}/cover`, fd)
}

export const deleteGroupMember = (group: number, member: number): AxiosPromise<boolean> => axios.delete(`/group/${group}/member/${member}`)

export const promoteGroupMember = (group: number, member: number): AxiosPromise<boolean> => axios.post(`/group/${group}/member/${member}/promote`)

export const demoteGroupMember = (group: number, member: number): AxiosPromise<boolean> => axios.post(`/group/${group}/member/${member}/demote`)



