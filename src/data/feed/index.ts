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

export const getFeed = (id: number): AxiosPromise<Feed> => {
    return axios.get(`/feed/${id}`);
}

export const createFeed = (form: FeedForm): AxiosPromise<Feed> => {
    const fd = new FormData();
    fd.append('file', form.cover as Blob);

    delete form.cover;
    delete form.resetCover;
    fd.append('form', JSON.stringify(form));
    return axios.post(`/feed`, fd)
}


export const updateFeed = (id: number, form: FeedForm): AxiosPromise<Feed> => {
    const fd = new FormData();
    fd.append('file', form.cover as Blob);

    console.log(form);
    delete form.cover;
    fd.append('form', JSON.stringify(form));
    return axios.put(`/feed/${id}`, fd)
}

export const deleteFeed = (id: number): AxiosPromise<void> => {
    return axios.delete(`/feed/${id}`);
}

export const toggleFeedArchiveStatus = (id: number): AxiosPromise<Feed> => {
    return axios.put(`/feed/${id}/archive`);
}