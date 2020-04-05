import {Student, StudentAdminForm} from "./types";
import {ClubMemberView} from "../club/types";
import axios, {AxiosPromise} from "axios";
import axios from 'axios';
import {Page} from "../request.type";

export function getLoggedUser(): AxiosPromise<Student> {
    return axios.get('/student/me');
}

export function getStudent(id: number): AxiosPromise<Student> {
    return axios.get(`/student/${id}`);
}

export const getAllStudents = (page: number = 0): AxiosPromise<Page<Student>> => {
    return axios.get('/student', { params: {page}});
};

export const getAllStudentsAdmin = (page: number = 0): AxiosPromise<Page<Student>> => {
    return axios.get('/student/admin', { params: {page}});
};

export const createStudent = (student: StudentAdminForm): AxiosPromise<Student> => {
    return axios.post(`/student`, student);
};

export const updateStudent = (id: number): AxiosPromise<Student> => {
    return axios.put(`/student/${id}`);
};

export const updateStudentAdmin = (form: StudentAdminForm): AxiosPromise<Student> => {
    return axios.put(`/student/admin`, form);
};

export const toggleStudentArchiveStatus = (id: number): AxiosPromise<boolean> => {
    return axios.put(`/student/${id}/archive`);
};


export const deleteStudent = (id: number): AxiosPromise<void> => {
    return axios.delete(`/student/${id}`);
};


export const getClubsForStudent = (studentId: number): AxiosPromise<ClubMemberView[]> => {
    return axios.get(`/student/${studentId}/club`);
};