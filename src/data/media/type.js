// @flow

import type { Student } from '../users/type';
import type { Club } from '../users/type';

type EventValue = {
  mediaType: 'event',
  title: string,
  location: string,
  date: Date,
  description: string,
  club: Club,
  imageUrl: string,
};

export type Event = MediaValue & EventValue;

type PollValue = {
  mediaType: 'poll',
  title: string,
  answers: Array<string>,
  isMultiAnswers: boolean,
  endDate: Date,
};

export type Poll = MediaValue & PollValue;

export type Answer = {
  id: number,
};

type VideoEmbedType = 'YOUTUBE' | 'FACEBOOK';

export type VideoEmbed = {
  mediaType: 'videoEmbed',
  type: VideoEmbedType,
  url: string,
};

type VideoValue = {
  mediaType: 'video',
  name: string,
  url: string,
  poster: string,
};
export type Video = MediaValue & VideoValue;

type ImageValue = {
  mediaType: 'image',
  thumbUrl: string,
  fullSizeUrl: string,
  originalUrl: string,
  matched: Match[],
};
export type Image = MediaValue & ImageValue;

export type Match = {
  id: number,
  match: Student,
  owner: Student,
};

type GalleryValue = {
  mediaType: 'gallery',
  name: string,
  images: Image[],
  coverImage: ?Image,
  previewImage: Image[],
};
export type Gallery = MediaValue & GalleryValue;

type GazetteValue = {
  mediaType: 'gazette',
  title: string,
  url: string,
};
export type Gazette = MediaValue & GazetteValue;

type DocumentValue = {
  mediaType: 'document',
  name: string,
  path: string,
  originalName: string,
};
export type Document = MediaValue & DocumentValue;

type MediaValue = {
  id: number,
  creation: Date,
};

export type Media = MediaValue &
  (
    | GalleryValue
    | ImageValue
    | EventValue
    | DocumentValue
    | GazetteValue
    | PollValue
    | VideoValue
  );
