import axios, {AxiosPromise} from "axios";
import {Post, PostCreation} from "./types";

export const createPost = (post: PostCreation): AxiosPromise<Post> => {
    return axios.post("/post", post);
};