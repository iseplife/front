import axios, {AxiosPromise} from "axios"
import {Gallery} from "./types"

export const getGallery = (id: string): AxiosPromise<Gallery> => axios.get(`/gallery/${id}`)
