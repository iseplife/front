import axios, {AxiosPromise} from "axios"
import {Gallery, GalleryForm} from "./types"

export const getGallery = (id: string): AxiosPromise<Gallery> => axios.get(`/gallery/${id}`)

export const createGallery = (form: GalleryForm): AxiosPromise<Gallery> => axios.post("gallery", form)

