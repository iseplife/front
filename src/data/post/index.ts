import {AxiosPromise} from "axios"
import {BasicPostCreation, PostCreation, PostUpdate, PostUpdateForm} from "./types"
import {Author} from "../request.type"
import {apiClient} from "../http"

export const createPost = (post: BasicPostCreation | PostCreation): AxiosPromise<PostUpdate> =>  apiClient.post("/post", post)

export const updatePost = (id: number, update: PostUpdateForm): AxiosPromise<PostUpdate> => apiClient.put(`/post/${id}`, update)

export const deletePost = (id: number): AxiosPromise<void> => apiClient.delete(`/post/${id}`)

export const getAuthorsThumbnail = (clubOnly = false): AxiosPromise<Author[]> => apiClient.get("/post/authors", {params: {club: clubOnly}})
