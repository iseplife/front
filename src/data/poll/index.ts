import axios, {AxiosPromise} from "axios"
import {Poll, PollCreation} from "./types"


export const createPoll = (form: PollCreation): AxiosPromise<Poll> => axios.post("/poll", form)