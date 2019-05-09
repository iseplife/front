// @flow

import type { Student } from '../users/type';

export type ClubMember = {
  id: number,
  role: ClubRole,
  member: Student,
};

export type ClubRole = {
  id: number,
  name: string,
};
