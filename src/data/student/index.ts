import axios, {AxiosPromise} from "axios";
import {Student} from "./types";
import {ClubMemberView} from "../club/types";
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
    return axios.get('/student', { params: {page}});
};

export const getClubsForStudent = (studentId: number): AxiosPromise<ClubMemberView[]> => {
    return axios.get(`/student/${studentId}/club`);
};