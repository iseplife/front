import {AxiosPromise} from "axios"
import {Media} from "./types"
import {apiClient} from "../../index"

export const createMedia = (file: File, club?: number, gallery = false, nsfw = false, progressListener?: (progressEvent: any) => void): AxiosPromise<Media> => {
    const fd = new FormData()
    fd.append("file", file as Blob)

    return apiClient.post("/media", fd, {params: {club, gallery, nsfw}, onUploadProgress: progressListener})
}
