import { AxiosPromise } from "axios"
import { apiClient } from "../http"
import { PasswordChangeRequest } from "./types"

export const changeAlumniPassword = (passwordData: PasswordChangeRequest): AxiosPromise<void> => 
    apiClient.post("/alumni-auth/change-password", passwordData) 
