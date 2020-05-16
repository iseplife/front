import axios, {AxiosPromise} from "axios";
import {Post} from "../post/types";
import {Page} from "../request.type";

export const getFeedPost = (id: number, page: number = 0): AxiosPromise<Page<Post>> => {
    return axios.get(`/feed/${id}/post`, {
        params: {page}
    });
};