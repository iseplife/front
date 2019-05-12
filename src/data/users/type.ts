export type StudentUpdate = {
  id?: number;
  birthDate?: number;
  phone?: string;
  bio?: string;
  mail: string;
  address: string;
};

type ClubValue = {
  name: string;
  description: string;
  creation: number;
  website: string;
  admin: boolean;
  logoUrl: string;
};
export type Club = AuthorValue & ClubValue;

type StudentValue = {
  promo: number;
  firstname: string;
  lastname: string;
  birthDate?: number;
  phone?: string;
  address?: string;
  studentId: string;
  mail?: string;
  mailISEP?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  snapchat?: string;
  allowNotifications: boolean;
  photoUrl?: string;
  photoUrlThumb?: string;
  bio?: string;
  archived: boolean;
  rolesValues: string[];
};

export type Student = AuthorValue & StudentValue;

type EmployeeValue = {
  firstname: string;
  lastname: string;
};

export type Employee = AuthorValue & EmployeeValue;

export type CreateEmployee = EmployeeValue;

export type AuthorType = 'student' | 'club' | 'employee';

type AuthorValue = {
  id: number;
  authorType: AuthorType;
};

export type Author = Student | Club | Employee;

export type Role = {
  id: number;
  role: string;
};
