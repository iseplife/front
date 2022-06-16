import {AxiosPromise} from "axios"
import {Media, MediaUploadNSFW} from "./types"
import { apiClient } from "../http"
import FastAverageColor from "fast-average-color"

const fac = new FastAverageColor()

export const createMedia = (media: MediaUploadNSFW, club?: number, gallery = false, progressListener?: (progressEvent: any) => void): AxiosPromise<Media> => {
    const url = URL.createObjectURL(media.file as Blob)
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
            const fd = new FormData()
        
            fd.append("file", media.file as Blob)
            fd.append("nsfw", Boolean(media.nsfw).toString())
            fd.append("color", fac.getColor(img, { algorithm: "sqrt" }).hex.substring(1))
            fd.append("ratio", (img.width / img.height).toString())
            
            URL.revokeObjectURL(url)
            
            resolve(apiClient.post("/media", fd, { params: { club, gallery, nsfw: media.nsfw }, onUploadProgress: progressListener }))
        }
        img.onerror = reject
        img.src = url
    })
}

export const toggleMediaNSFW = (id: number): AxiosPromise<boolean> => apiClient.put(`${id}/nsfw`)
