import axios, {AxiosPromise} from "axios"
import {Comment, CommentForm} from "./types"

export const toggleThreadLike = (id: number): AxiosPromise<boolean> => {
    return axios.put(`/thread/${id}/like`)
}

export const getThreadComments = (id: number): AxiosPromise<Comment[]> => {
    return axios.get(`/thread/${id}/comment`)
}

export const commentThread = (id: number, comment: CommentForm): AxiosPromise<Comment> => {
    return axios.put(`/thread/${id}/comment`, comment)
}

export const editThreadComment = (id: number, comID: number, message: string): AxiosPromise<Comment> => {
    return axios.put(`/thread/${id}/comment/${comID}`, {message})
}

export const deleteThreadComment = (id: number, comID: number): AxiosPromise<void> => {
    return axios.delete(`/thread/${id}/comment/${comID}`)
}