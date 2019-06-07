import { Author, Student } from '../users/type';
import { Media } from '../media/type';

export type PostCreation = {
  authorId: number;
  content: string;
  title?: string;
  private: boolean;
};

export type Post = {
  id: number;
  title?: string;
  creationDate: number;
  private: boolean;
  pinned: boolean;
  content: string;
  media: Media;
  author: Author;
  nbComments: number;
  nbLikes: number;
  liked: boolean;
  hasWriteAccess: boolean;
};

export type Comment = {
  id: number;
  student: Student;
  creation: number;
  message: string;
  likes: Student[];
  liked: boolean;
};
