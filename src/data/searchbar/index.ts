import axios, {AxiosPromise} from "axios";

export const getFakeData = (): AxiosPromise<any> => {
    return axios.get("https://jsonplaceholder.typicode.com/users");
};

export const searchClub = (name: string): AxiosPromise<any> => {
    return axios.get("/search/club", { params: {filter: name}});
};

export const globalSearch = (name: string): AxiosPromise<any> => {
    return axios.get("/search", { params: {filter: name}});
};