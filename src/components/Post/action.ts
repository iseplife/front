import { apiClient } from "../../data/http"
import PollVoteItem, { LikePreview } from "./types"

export const getPollVotes = (id: number) => {
    return apiClient.get<PollVoteItem[]>(`/poll/${id}/vote`)
}
export const getLikes = (threadId: number) => {
    return apiClient.get<LikePreview[]>(`/thread/${threadId}/likes`)
}