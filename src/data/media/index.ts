import {AxiosPromise, AxiosResponse} from "axios"
import {Media, MediaUploadNSFW} from "./types"
import { apiClient } from "../http"
import FastAverageColor from "fast-average-color"
import { EmbedEnumType } from "../post/types"

const fac = new FastAverageColor()

export const createMedia = async (media: MediaUploadNSFW, type: EmbedEnumType, club?: number, gallery = false, progressListener?: (progressEvent: any) => void): Promise<AxiosResponse<Media>> => {
    const fd = new FormData()
    fd.append("file", media.file as Blob)
    fd.append("nsfw", Boolean(media.nsfw).toString())
    if(type == EmbedEnumType.IMAGE){
        const url = URL.createObjectURL(media.file as Blob)
        await new Promise<void>((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
                fd.append("color", fac.getColor(img, { algorithm: "sqrt" }).hex.substring(1))
                fd.append("ratio", (img.width / img.height).toString())
                
                URL.revokeObjectURL(url)
                
                resolve()
            }
            img.onerror = reject
            img.src = url
        })
    }else if(type == EmbedEnumType.VIDEO){
        const url = URL.createObjectURL(media.file as Blob)
        await new Promise<void>((resolve, reject) => {
            const video = document.createElement("video")

            video.addEventListener("loadedmetadata", () => {
                const height = video.videoHeight
                const width = video.videoWidth
                fd.append("ratio", (width / height).toString())
                
                URL.revokeObjectURL(url)
                
                resolve()
            }, false)
            video.onerror = reject
            video.src = url
        })
    }
    return await apiClient.post("/media", fd, { params: { club, gallery, nsfw: media.nsfw }, onUploadProgress: progressListener })
}

export const toggleMediaNSFW = (id: number): AxiosPromise<boolean> => apiClient.put(`${id}/nsfw`)
