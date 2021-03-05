import {AxiosPromise, CancelToken} from "axios"
import {Page} from "../request.type"
import {SearchItem} from "./types"
import {apiClient} from "../../index"

export const searchClub = (name: string, page: number): AxiosPromise<Page<SearchItem>> => apiClient.get("/search/club", {params: {name: name, page: page}})

export const searchStudent = (name: string, promos: string, page: number): AxiosPromise<Page<SearchItem>> => apiClient.get("/search/student", {params: {name: name, promos: promos, page: page}})


export const searchEvent = (name: string, page: number): AxiosPromise<Page<SearchItem>> => apiClient.get("/search/event", {params: {name: name, page: page}})


export const globalSearch = (name: string, page: number, token?: CancelToken): AxiosPromise<Page<SearchItem>> => apiClient.get("/search", {params: {name: name, page: page}, cancelToken: token})
