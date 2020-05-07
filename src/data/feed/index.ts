import axios, {AxiosPromise} from "axios";
import {Post} from "../post/types";
import {Page} from "../request.type";
import {Feed, FeedForm} from "./types";

export const getFeedPost = (id: number, page: number = 0): AxiosPromise<Page<Post>> => {
    return axios.get(`/feed/${id}/post`, {
        params: {page}
    });
};

export const getAllFeed = (page: number = 0): AxiosPromise<Page<Feed>> => {
    return axios.get(`/feed`, {
        params: {page}
    });
}

export const createFeed = (form: FeedForm): AxiosPromise<Page<Feed>> => {
    return axios.post(`/feed`, {form})
}