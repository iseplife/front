import axios, {AxiosPromise} from "axios"
import {Post, PostCreation, PostUpdate} from "./types"
import {Author} from "../request.type"

export const createPost = (post: PostCreation): AxiosPromise<Post> =>  axios.post("/post", post)

export const updatePost = (id: number, update: PostUpdate): AxiosPromise<void> => axios.put(`/post/${id}`, update)

export const deletePost = (id: number): AxiosPromise<void> => axios.delete(`/post/${id}`)

export const getAuthorsThumbnail = (clubOnly = false): AxiosPromise<Author[]> => axios.get("/post/authors", {params: {club: clubOnly}})