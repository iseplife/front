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
    return axios.post(`/feed`, {form})
}


export const updateFeed = (form: FeedForm): AxiosPromise<Feed> => {
    return axios.put(`/feed/${form.id}`, {form})
}

export const deleteFeed = (id: number): AxiosPromise<void> => {
    return axios.delete(`/feed/${id}`);
}

export const toggleFeedArchiveStatus = (id: number): AxiosPromise<Feed> => {
    return axios.get(`/feed/${id}/archive`);
}