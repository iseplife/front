import { apiClient } from "../../http"
import { WeiAvailableRoom, WeiRoom } from "./types"

export const getAvailableRooms = () => apiClient.get<WeiAvailableRoom[]>("/wei/rooms/available")
export const getRoom = (id: string) => apiClient.get<WeiRoom>(`/wei/rooms/${id}`)
export const getMyRoom = () => apiClient.get<{id: string}>("/wei/rooms/me", {responseType: "text"})
export const bookRoom = (size: number) => apiClient.get<{id: string}>(`/wei/rooms/book/${size}`, {responseType: "text"})
export const joinRoom = (id: string) => apiClient.post<WeiRoom>(`/wei/rooms/${id}/join`)
export const deleteRoom = (id: string) => apiClient.post<void>(`/wei/rooms/${id}/delete`)