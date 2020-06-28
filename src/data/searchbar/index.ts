import axios, {AxiosPromise} from "axios";

export const searchClub = (name: string, page: number): AxiosPromise<any> => {
    return axios.get("/search/club", {params: {name: name, page: page}});
};

export const searchStudent = (name: string, promos: string, page: number): AxiosPromise<any> => {
    return axios.get("/search/student", {params: {name: name, promos: promos, page: page}});
};

export const searchEvent = (name: string, page: number): AxiosPromise<any> => {
    return axios.get("/search/event", {params: {name: name, page: page}});
};

export const globalSearch = (name: string, page: number): AxiosPromise<any> => {
    return axios.get("/search", {params: {name: name, page: page}});
};