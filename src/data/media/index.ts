import axios, {AxiosPromise} from "axios"
import {Media} from "./types"

export const createMedia = (file: File, gallery = false, nsfw = false, progressListener?: (progressEvent: any) => void):  AxiosPromise<Media> => {
    const fd = new FormData()
    fd.append("file", file as Blob)

    return axios.post("/media", fd, {params: {gallery, nsfw}, onUploadProgress: progressListener})
}