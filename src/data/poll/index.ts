import axios, {AxiosPromise} from "axios"
import {Poll, PollChoice, PollCreation} from "./types"


export const createPoll = (form: PollCreation): AxiosPromise<Poll> => axios.post("/poll", form)

export const getPollVotes = (poll: number): AxiosPromise<PollChoice[]> => axios.get(`/poll/${poll}/vote`)

export const addVote = (poll: number, choice: number): AxiosPromise<void> => axios.post(`/poll/${poll}/choice/${choice}`)

export const removeVote = (poll: number, choice: number): AxiosPromise<void> => axios.delete(`/poll/${poll}/choice/${choice}`)