import axios, {AxiosPromise} from "axios";
import {Club} from "./type";

export const getClubById = (id: string): AxiosPromise<Club> => {
    return axios.get(`/club/${id}`);
};