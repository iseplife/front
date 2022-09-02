import {AxiosPromise} from "axios"
import {BasicPostCreation, PostCreation, PostUpdate, PostUpdateForm} from "./types"
import {Author} from "../request.type"
import {apiClient} from "../http"

export const createPost = (post: BasicPostCreation | PostCreation): AxiosPromise<PostUpdate> => apiClient.post("/post", post)

export const updatePost = (id: number, update: PostUpdateForm): AxiosPromise<PostUpdate> => apiClient.put(`/post/${id}`, update)

export const deletePost = (id: number): AxiosPromise<void> => apiClient.delete(`/post/${id}`)

export const reportPost = (id: number): AxiosPromise<void> => apiClient.put(`/post/${id}/report`)

export const pinPost = (id: number, pinned: boolean, homepage = false): AxiosPromise<void> => apiClient.put(`/post/${id}/pin`, {}, {
    params: {
        homepage,
        pinned
    }
})

export const homepageForcedPost = (id: number, forced: boolean): AxiosPromise<void> => apiClient.put(`/post/${id}/homepage`, {}, {
    params: {forced}
})

export const getAuthorizedAuthors = (): AxiosPromise<Author[]> => apiClient.get("/post/authors")
