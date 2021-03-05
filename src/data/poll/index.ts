import {AxiosPromise} from "axios"
import {Poll, PollChoice, PollCreation} from "./types"
import {apiClient} from "../../index"


export const createPoll = (form: PollCreation): AxiosPromise<Poll> => apiClient.post("/poll", form)

export const getPollVotes = (poll: number): AxiosPromise<PollChoice[]> => apiClient.get(`/poll/${poll}/vote`)

export const addVote = (poll: number, choice: number): AxiosPromise<void> => apiClient.post(`/poll/${poll}/choice/${choice}`)

export const removeVote = (poll: number, choice: number): AxiosPromise<void> => apiClient.delete(`/poll/${poll}/choice/${choice}`)