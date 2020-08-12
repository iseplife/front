import axios, {AxiosPromise} from "axios"
import {Post} from "../post/types"
import {Page} from "../request.type"
import {Feed} from "./types"

export const getFeedPost = (id: number, page = 0): AxiosPromise<Page<Post>> => {
    return axios.get(`/feed/${id}/post`, {
        params: {page}
    })
}

export const getUserFeed = (): AxiosPromise<Feed[]> => axios.get("/feed")