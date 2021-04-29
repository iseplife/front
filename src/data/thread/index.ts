import {AxiosPromise} from "axios"
import {Comment, CommentForm} from "./types"
import {apiClient} from "../http"

export const toggleThreadLike = (id: number): AxiosPromise<boolean> => {
    return apiClient.put(`/thread/${id}/like`)
}

export const getThreadComments = (id: number): AxiosPromise<Comment[]> => {
    return apiClient.get(`/thread/${id}/comment`)
}

export const commentThread = (id: number, comment: CommentForm): AxiosPromise<Comment> => {
    return apiClient.put(`/thread/${id}/comment`, comment)
}

export const editThreadComment = (id: number, comID: number, message: string): AxiosPromise<Comment> => {
    return apiClient.put(`/thread/${id}/comment/${comID}`, {message})
}

export const deleteThreadComment = (id: number, comID: number): AxiosPromise<void> => {
    return apiClient.delete(`/thread/${id}/comment/${comID}`)
}