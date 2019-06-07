import { Student, Club } from '../users/type';

type EventValue = {
  mediaType: 'event';
  title: string;
  location: string;
  date: number;
  description: string;
  club: Club;
  imageUrl: string;
};

export type Event = MediaValue & EventValue;

type PollValue = {
  mediaType: 'poll';
  name: string;
  endDate: number;
  answers: PollAnswer[];
  multiAnswers: boolean;
};

export type PollAnswer = {
  id: number;
  content: string;
  votes: PollVote[];
  voters: number[];
  votesNb: number;
};

export type PollVote = {
  id: number;
  student: Student;
  answer: PollAnswer;
};

export type Poll = MediaValue & PollValue;

type VideoEmbedType = 'YOUTUBE' | 'FACEBOOK';

export type VideoEmbed = {
  mediaType: 'videoEmbed';
  type: VideoEmbedType;
  url: string;
};

type VideoValue = {
  mediaType: 'video';
  name: string;
  url: string;
  poster: string;
};
export type Video = MediaValue & VideoValue;

export type MatchedView = {
  id: number;
  image: Image;
  owner: Student;
  galleryId: number;
};

type ImageValue = {
  mediaType: 'image';
  thumbUrl: string;
  fullSizeUrl: string;
  originalUrl: string;
  matched: Match[];
};
export type Image = MediaValue & ImageValue;

export type Match = {
  id: number;
  match: Student;
  owner: Student;
};

type GalleryValue = {
  mediaType: 'gallery';
  name: string;
  images: Image[];
  coverImage?: Image;
  previewImages: Image[];
};
export type Gallery = MediaValue & GalleryValue;

type GazetteValue = {
  mediaType: 'gazette';
  title: string;
  url: string;
};
export type Gazette = MediaValue & GazetteValue;

type DocumentValue = {
  mediaType: 'document';
  name: string;
  path: string;
  originalName: string;
};
export type Document = MediaValue & DocumentValue;

type MediaValue = {
  id: number;
  creation: number;
  postId: number;
};

export type Media = MediaValue &
  (
    | GalleryValue
    | ImageValue
    | EventValue
    | DocumentValue
    | GazetteValue
    | PollValue
    | VideoValue);
