import axios, {AxiosPromise} from "axios";
import {Gallery} from "./type";

export const getGalleryById = (id: number): AxiosPromise<Gallery> => {
    return axios.get(`/gallery/${id}`);
};
