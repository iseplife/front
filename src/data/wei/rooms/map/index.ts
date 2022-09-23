import { apiClient } from "../../../http"
import { WeiMapEntity, WeiMapFriend } from "./types"

export const getMapEntities = () => apiClient.get<WeiMapEntity[]>("/wei/map/entities")
export const isActivated = () => apiClient.get<{enabled: boolean, snapmap: boolean}>("/wei/map/activated")
export const sendLocation = (lat: number, lng: number) => apiClient.put<void>("/wei/map/location", {lng, lat})
export const getFriendsLocation = () => apiClient.get<WeiMapFriend[]>("/wei/map/friends")
export const getMapBackground = () => apiClient.get<{color: string, assetUrl: string}>("/wei/map/background")
