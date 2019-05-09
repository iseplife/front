// @flow

import type { Author } from '../../data/users/type';

export type SessionDor = {
  id: number,
  firstTurn: Date,
  secondTurn: Date,
  result: Date,
  enabled: boolean,
};

export type SessionDorCreate = {
  firstTurn: ?Date,
  secondTurn: ?Date,
  result: ?Date,
};

export type QuestionDor = {
  id: number,
  position: number,
  title: string,
  enableClub: boolean,
  enableStudent: boolean,
  enableEmployee: boolean,
  enableEvent: boolean,
  enableParty: boolean,
  enablePromo: boolean,
  promo: number,
};

export type QuestionDorCreate = {
  position: number,
  title: string,
  enableClub: boolean,
  enableStudent: boolean,
  enableEmployee: boolean,
  enableEvent: boolean,
  enableParty: boolean,
  enablePromo: boolean,
  promo: number,
};

export type EventDor = {
  id: number,
  name: string,
  party: boolean,
};

export type EventDorCreate = {
  name: string,
  party: boolean,
};

export type AnswerDor = {
  type: 'author' | 'event',
  value: Author & EventDor,
  score?: number,
};

export type VoteDor = {
  id: number,
  resAuthor: ?Author,
  resEvent: ?EventDor,
  questionDor: QuestionDor,
  date: Date,
  round: number,
};

export type AnswerDorScore = {
  idAnswer: number,
  type: 'USER' | 'EVENT',
  voteDor: VoteDor,
  score: number,
};

type DorConfigAttribute = {
  x: number,
  y: number,
  fontSize: number,
};

export type ConfigDor = {
  titre: DorConfigAttribute,
  name: DorConfigAttribute,
  birthdate: DorConfigAttribute,
};
