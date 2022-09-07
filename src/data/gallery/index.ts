import  {AxiosPromise} from "axios"
import {Gallery, GalleryForm} from "./types"
import {apiClient} from "../http"

export const getGallery = (id: number): AxiosPromise<Gallery> => apiClient.get(`/gallery/${id}`)

export const createGallery = (form: GalleryForm): AxiosPromise<Gallery> => apiClient.post("gallery", form)

export const deleteGallery = (id: number): AxiosPromise<boolean> => apiClient.delete(`gallery/${id}`)

export const addGalleryImages = (gallery: number, images: number[]): AxiosPromise<void> =>
    apiClient.put(`/gallery/${gallery}/images`, undefined, {
        params: {
            id: images.join(",").trim()
        }
    })

export const deleteGalleryImages = (gallery: number, images: number[]): AxiosPromise<void> =>
    apiClient.delete(`/gallery/${gallery}/images`, {
        params: {
            id: images.join(",").trim()
        }
    })

