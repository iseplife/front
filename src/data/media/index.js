// @flow

import axios from 'axios';
import type { AxiosPromise } from 'axios';

import type { Media } from './type';
import type { Page } from '../request.type';

export function getAllMedia(page: number = 0): AxiosPromise<Page<Media>> {
  return axios.get(`/media?page=${page}`);
}

export function groupMedia(list: Media[]): Media[] {
  const monthlyGrouped = {};
  list.forEach(media => {
    const date = new Date(media.creation);
    const formedDate = date.getMonth() + '-' + date.getFullYear();
    if (!monthlyGrouped[formedDate]) {
      monthlyGrouped[formedDate] = {
        date,
        medias: [],
      };
    }
    monthlyGrouped[formedDate].medias.push(media);
  });
  return Object.keys(monthlyGrouped)
    .map(k => monthlyGrouped[k])
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function createDocument(
  postId: number,
  {
    name,
    document,
  }: {
    name: string,
    document: File,
  }
) {
  const form = new FormData();
  form.append('post', String(postId));
  form.append('name', name);
  form.append('document', document);
  return axios.post('/media/document', form);
}

export function createGazette(
  postId: number,
  { title, file }: { title: string, file: File }
) {
  const form = new FormData();
  form.append('post', String(postId));
  form.append('title', title);
  form.append('file', file);
  return axios.post('/media/gazette', form);
}

export function createEvent(postId: number, state: any, authorId: number) {
  const form = new FormData();
  form.append('post', String(postId));
  form.append(
    'event',
    JSON.stringify({
      title: state.title,
      location: state.location,
      date: state.date.getTime(),
      description: state.description,
      clubId: authorId,
    })
  );
  form.append('image', state.image);
  return axios.post('/event', form);
}
