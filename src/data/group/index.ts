import axios, {AxiosPromise} from "axios";
import {Page} from "../request.type";
import {Group, GroupForm} from "./types";

export const getAllGroup = (page: number = 0): AxiosPromise<Page<Group>> => {
    return axios.get(`/group`, {
        params: {page}
    });
}

export const getGroup = (id: number): AxiosPromise<Group> => {
    return axios.get(`/group/${id}`);
}

export const createGroup = (form: GroupForm): AxiosPromise<Group> => {
    const fd = new FormData();
    fd.append('file', form.cover as Blob);

    delete form.cover;
    delete form.resetCover;
    fd.append('form', JSON.stringify(form));
    return axios.post(`/group`, fd)
}


export const updateGroup = (id: number, form: GroupForm): AxiosPromise<Group> => {
    const fd = new FormData();
    fd.append('file', form.cover as Blob);

    delete form.cover;
    fd.append('form', JSON.stringify(form));
    return axios.put(`/group/${id}`, fd);
}

export const deleteGroup = (id: number): AxiosPromise<void> => {
    return axios.delete(`/group/${id}`);
}

export const toggleGroupArchiveStatus = (id: number): AxiosPromise<Group> => {
    return axios.put(`/group/${id}/archive`);
}
