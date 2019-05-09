// @flow

import type { Media } from '../media/type';
import type { Author, Student } from '../users/type';

export type PostCreation = {
  authorId: number,
  content: string,
  title: ?string,
  private: boolean,
};

export type Post = {
  id: number,
  title: ?string,
  creationDate: Date,
  private: boolean,
  pinned: boolean,
  content: string,
  media: Media,
  author: Author,
  nbComments: number,
  nbLikes: number,
  liked: boolean,
  hasWriteAccess: boolean,
};

export type Comment = {
  id: number,
  student: Student,
  creation: Date,
  message: string,
  likes: Student[],
  liked: boolean,
}