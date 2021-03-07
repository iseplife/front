import {AxiosPromise} from "axios"
import {Post, PostCreation, PostUpdate} from "./types"
import {Author} from "../request.type"
import {apiClient} from "../http"

export const createPost = (post: PostCreation): AxiosPromise<Post> =>  apiClient.post("/post", post)

export const updatePost = (id: number, update: PostUpdate): AxiosPromise<void> => apiClient.put(`/post/${id}`, update)

export const deletePost = (id: number): AxiosPromise<void> => apiClient.delete(`/post/${id}`)

export const getAuthorsThumbnail = (clubOnly = false): AxiosPromise<Author[]> => apiClient.get("/post/authors", {params: {club: clubOnly}})