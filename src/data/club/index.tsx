import axios, {AxiosPromise} from "axios";
import {Club, ClubMember} from "./type";
import {Post} from "../post/types";
import {Page} from "../request.type";
import {Gallery} from "../gallery/type";

export const getClubById = (id: string): AxiosPromise<Club> => {
    return axios.get(`/club/${id}`);
};

export const getClubMembers = (id: string): AxiosPromise<ClubMember[]> => {
    return axios.get(`/club/${id}/member`)
};

export const getClubPosts = (id: string): AxiosPromise<any> => {
  return axios.get(`/club/${id}/post`)
};

export const getClubGalleries = (id: string): AxiosPromise<Page<Gallery>> => {
    return axios.get(`/club/${id}/galleries`);
}