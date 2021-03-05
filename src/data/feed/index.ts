import {AxiosPromise} from "axios"
import {Post} from "../post/types"
import {Page} from "../request.type"
import {Feed} from "./types"
import {apiClient} from "../../index"

export const getFeedPost = (id: number, page = 0): AxiosPromise<Page<Post>> => (
    apiClient.get(`/feed/${id}/post`, {
        params: {page}
    })
)

export const toggleSubscription = (id: number): AxiosPromise<boolean> => apiClient.post(`/feed/${id}/subscribe`)

export const getUserFeed = (): AxiosPromise<Feed[]> => apiClient.get("/feed")