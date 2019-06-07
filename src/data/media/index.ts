import axios, { AxiosPromise } from 'axios';
import { Page } from '../request.type';
import { Media } from './type';

export function getAllMedia(page: number = 0): AxiosPromise<Page<Media>> {
  return axios.get(`/media?page=${page}`);
}

export function groupMedia(list: Media[]): { date: Date; medias: Media[] }[] {
  const monthlyGrouped = {} as {
    [key: string]: { date: Date; medias: Media[] };
  };
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
  return Object.values(monthlyGrouped).sort((a, b) =>
    a.date < b.date ? 1 : -1
  );
}

export function createDocument(
  postId: number,
  {
    name,
    document,
  }: {
    name: string;
    document: File;
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
  { title, file }: { title: string; file: File }
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
      date: state.date,
      description: state.description,
      clubId: authorId,
    })
  );
  form.append('image', state.image);
  return axios.post('/event', form);
}
