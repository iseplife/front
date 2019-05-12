import { Student, Club } from '../users/type';

export type ClubMember = {
  id: number;
  role: ClubRole;
  member: Student;
  club: Club;
};

export type ClubRole = {
  id: number;
  name: string;
};
