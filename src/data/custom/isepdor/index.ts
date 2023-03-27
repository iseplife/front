import { AxiosPromise } from "axios"
import { apiClient } from "../../http"
import { IORQuestion, IORSession, IORVotedQuestion } from "./types"

export const getCurrentSession = (): AxiosPromise<IORSession> => apiClient.get("/ior/current")
export const getQuestions = (session: IORSession): AxiosPromise<IORVotedQuestion[]> => apiClient.get(`/ior/${session.id}/questions`)
export const voteIORQuestion = (question: IORQuestion, voted: number): AxiosPromise<IORVotedQuestion> => apiClient.post(`/ior/question/${question.id}/${voted}`)