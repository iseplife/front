import axios, {AxiosPromise} from "axios";
import {Post} from "../post/types";
import {Page} from "../request.type";

export const getFeedPost = (name: string, page: number = 0): AxiosPromise<Page<Post>> => {
    return axios.get(`/feed/${name}?page=${page}`);
};