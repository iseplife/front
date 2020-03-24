import axios, {AxiosPromise} from "axios";
import {Student} from "./types";

export function getLoggedUser(): AxiosPromise<Student> {
    return axios.get('/student/me');
}

export const getStudentById = (studentId: number): AxiosPromise<Student> => {
    return axios.get(`/student/${studentId}`);
};

export const getClubsForStudent = (studentId: number): AxiosPromise<any> => {
    return axios.get(`/student/${studentId}/club`);
};