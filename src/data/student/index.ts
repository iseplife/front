import {AxiosPromise} from "axios";
import {Student, StudentAdminForm, StudentAdmin, StudentPreview, StudentPreviewAdmin} from "./types";
import {ClubMemberView} from "../club/types";
import axios, {AxiosPromise} from 'axios';
import {Page} from "../request.type";

export function getLoggedUser(): AxiosPromise<Student> {
    return axios.get('/student/me');
}

export function getStudent(id: number): AxiosPromise<Student> {
    return axios.get(`/student/${id}`);
}

export function getStudentAdmin(id: number): AxiosPromise<StudentAdmin> {
    return axios.get(`/student/${id}/admin`);
}

export const getAllStudents = (page: number = 0): AxiosPromise<Page<StudentPreview>> => {
    return axios.get('/student', { params: {page}});
};

export const getAllStudentsAdmin = (page: number = 0): AxiosPromise<Page<StudentPreviewAdmin>> => {
    return axios.get('/student/admin', { params: {page}});
};

export const createStudent = (student: StudentAdminForm): AxiosPromise<StudentAdmin> => {
    const fd = new FormData();
    fd.append('file', student.picture as Blob);

    delete student.picture;
    delete student.resetPicture;
    fd.append('form', JSON.stringify(student));

    return axios.post(`/student`, fd);
};

export const updateLoggedStudent = (id: number): AxiosPromise<Student> => {
    return axios.put(`/student/${id}`);
};

export const updateStudentAdmin = (form: StudentAdminForm): AxiosPromise<StudentAdmin> => {
    const fd = new FormData();
    fd.append('file', form.picture as Blob);

    delete form.picture;
    fd.append('form', JSON.stringify(form));

    return axios.put(`/student/admin`, fd);
};

export const toggleStudentArchiveStatus = (id: number): AxiosPromise<StudentAdmin> => {
    return axios.put(`/student/${id}/archive`);
};


export const deleteStudent = (id: number): AxiosPromise<void> => {
    return axios.delete(`/student/${id}`);
};


export const getClubsForStudent = (studentId: number): AxiosPromise<ClubMemberView[]> => {
    return axios.get(`/student/${studentId}/club`);
};