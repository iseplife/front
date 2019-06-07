import axios, { AxiosPromise } from 'axios';
import { PollAnswer, PollVote, Poll } from './type';

export function createPoll(postId: number, poll: Poll): AxiosPromise<Poll> {
  return axios.post(`/poll?post=${postId}`, poll);
}

export function getPoll(id: number): AxiosPromise<Poll> {
  return axios.get(`/poll/${id}`);
}

export function getAllVote(pollid: number): AxiosPromise<PollVote[]> {
  return axios.get(`/poll/${pollid}/vote/all`);
}

export function vote(pollId: number, answerId: number): AxiosPromise<void> {
  return axios.put(`/poll/${pollId}/answer/${answerId}`);
}

export function removeVote(
  pollid: number,
  answer: PollAnswer
): AxiosPromise<void> {
  return axios.delete(`/poll/${pollid}/answer/${answer.id}`);
}

export function getVotes(pollId: number): AxiosPromise<PollVote[]> {
  return axios.get(`/poll/${pollId}/vote`);
}
