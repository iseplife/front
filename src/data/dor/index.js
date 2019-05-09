// @flow
import axios from 'axios';
import type { AxiosPromise } from 'axios';
import { backUrl } from '../../config';
import type {
  SessionDorCreate,
  SessionDor,
  QuestionDor,
  QuestionDorCreate,
  EventDor,
  EventDorCreate,
  AnswerDor,
  VoteDor,
  AnswerDorScore,
  ConfigDor,
} from './type';

export function getSessions(): AxiosPromise<SessionDor[]> {
  return axios.get('/dor/session');
}

export function createSession(
  session: SessionDorCreate
): AxiosPromise<SessionDor> {
  return axios.post('/dor/session', session);
}

export function updateSession(
  id: number,
  session: SessionDor
): AxiosPromise<SessionDor> {
  return axios.put(`/dor/session/${id}`, session);
}

export function deleteSession(id: number): AxiosPromise<{}> {
  return axios.delete(`/dor/session/${id}`);
}

export function getQuestions(): AxiosPromise<QuestionDor[]> {
  return axios.get('/dor/question');
}

export function createQuestion(
  question: QuestionDorCreate
): AxiosPromise<QuestionDor> {
  return axios.post('/dor/question', question);
}

export function updateQuestion(
  id: number,
  question: QuestionDorCreate
): AxiosPromise<QuestionDor> {
  return axios.put(`/dor/question/${id}`, question);
}

export function deleteQuestion(id: number): AxiosPromise<{}> {
  return axios.delete(`/dor/question/${id}`);
}

export function getEvents(): AxiosPromise<EventDor[]> {
  return axios.get('/dor/event');
}

export function createEvent(event: EventDorCreate): AxiosPromise<EventDor> {
  return axios.post('/dor/event', event);
}

export function deleteEvent(id: number): AxiosPromise<{}> {
  return axios.delete(`/dor/event/${id}`);
}

export function updateEvent(
  id: number,
  event: EventDorCreate
): AxiosPromise<EventDor> {
  return axios.put(`/dor/event/${id}`, event);
}

export function handleVote(questionId: number, vote: AnswerDor) {
  const payload = {};
  switch (vote.type) {
    case 'author':
      payload.authorID = vote.value.id;
      break;
    case 'event':
      payload.eventID = vote.value.id;
      break;
    default:
      break;
  }
  return axios.put(`/dor/vote`, {
    questionID: questionId,
    ...payload,
  });
}

export function getCurrentVotes(round: number): AxiosPromise<VoteDor[]> {
  return axios.get(`/dor/vote/round/${round}`);
}

export function getCurrentSession(): AxiosPromise<SessionDor> {
  return axios.get('/dor/session/current');
}

export function getRoundResults(
  round: number
): AxiosPromise<{ [id: number]: AnswerDorScore[] }> {
  return axios.get(`/dor/session/current/round/${round}`);
}

export function getRoundResultsForQuestion(
  sessionId: number,
  round: number,
  questionId: number
): AxiosPromise<AnswerDorScore[]> {
  return axios.get(
    `/dor/session/${sessionId}/round/${round}/question/${questionId}`
  );
}

export function searchEvents(name: string): AxiosPromise<EventDor[]> {
  return axios.get(`/dor/event/search?name=${name}`);
}

export function getConfig(): AxiosPromise<ConfigDor> {
  return axios.get('/dor/config');
}

export function updateConfig(config: ConfigDor): AxiosPromise<void> {
  return axios.put('/dor/config', config);
}

export function updateDiploma(file: File): AxiosPromise<void> {
  const form = new FormData();
  form.append('diploma', file);
  return axios.put('/dor/config/diploma', form);
}

export function updateDiplomaFont(file: File): AxiosPromise<void> {
  const form = new FormData();
  form.append('font', file);
  return axios.put('/dor/config/font', form);
}

export function generateDiploma(id: number) {
  return axios.get(`/dor/session/${id}/diploma`);
}

const IMG_EVENT = '/img/svg/event-dor.svg';

function buildBackUrl(url: ?string): ?string {
  if (url) {
    return backUrl + url;
  }
  return null;
}

export function getAnswerData(
  ans: AnswerDorScore
): { name: ?string, url: ?string } {
  let name, url;
  if (ans) {
    switch (ans.type) {
      case 'USER':
        const author = ans.voteDor.resAuthor;
        if (author) {
          switch (author.authorType) {
            case 'student':
              name = `${author.firstname} ${author.lastname}`;
              url = author.photoUrlThumb
                ? buildBackUrl(author.photoUrlThumb)
                : '/img/svg/user.svg';
              break;
            case 'club':
              name = author.name;
              url = buildBackUrl(author.logoUrl);
              break;
            case 'employee':
              name = `${author.firstname} ${author.lastname}`;
              url = '/img/svg/user.svg';
              break;
          }
        }
        break;
      case 'EVENT':
        if (ans.voteDor.resEvent) {
          name = ans.voteDor.resEvent.name;
          url = IMG_EVENT;
        }
        break;
    }
  }
  return { name, url };
}
