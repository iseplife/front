import {AxiosPromise} from "axios";
import {Student} from "./types";
import axios from 'axios';

export function getLoggedUser(): AxiosPromise<Student> {
    return axios.get('/user/student/me');
}
