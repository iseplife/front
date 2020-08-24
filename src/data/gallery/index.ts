import axios, {AxiosPromise} from "axios"
import {Gallery, GalleryForm} from "./types"

export const getGallery = (id: string): AxiosPromise<Gallery> => axios.get(`/gallery/${id}`)

export const createGallery = (form: GalleryForm): AxiosPromise<Gallery> => axios.post("gallery", form)

export const deleteGallery = (id: number): AxiosPromise<boolean> => axios.delete(`gallery/${id}`)

export const addGalleryImages = (gallery: number, images: number[]): AxiosPromise<void> =>
    axios.put(`/gallery/${gallery}/images`, {params: {
        ids: images
    }})

