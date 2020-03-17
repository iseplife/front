import axios, {AxiosPromise} from "axios";
import {Comment} from "./types";

export const toggleThreadLike = (id: number): AxiosPromise<boolean> => {
    return axios.put(`/thread/${id}/like`);
};

export const getComment = (id: number): AxiosPromise<Comment[]> => {
    return axios.get(`/thead/${id}/comment`)
};