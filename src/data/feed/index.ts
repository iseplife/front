import {AxiosPromise} from "axios"
import {Post} from "../post/types"
import {Page} from "../request.type"
import {Feed} from "./types"
import {apiClient} from "../http"

export const getFeedPosts = (id?: number, page = 0): AxiosPromise<Page<Post>> => (
    apiClient.get(`/feed/${id == -1 ? "explore" : id ?? "main"}/post`, {
        params: {page}
    })
)
export const getFeedPost = (feedId: number, postId: number): AxiosPromise<Post> => (
    apiClient.get(`/feed/${feedId}/${postId}`)
)
export const getFeedPostsBefore = (id?: number, lastDate = 0): AxiosPromise<Page<Post>> => (
    apiClient.get(`/feed/${id == -1 ? "explore" : id ?? "main"}/prevposts`, {
        params: {lastDate}
    })
)

export const getFeedPostPinned = (id?: number): AxiosPromise<Post[]> => (
    apiClient.get(`/feed/${id ?? "main"}/post/pinned`)
)

export const toggleSubscription = (id: number): AxiosPromise<boolean> => apiClient.post(`/feed/${id}/subscribe`)

export const getUserFeed = (): AxiosPromise<Feed[]> => apiClient.get("/feed")