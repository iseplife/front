// @flow

import axios from 'axios';
import type { AxiosPromise } from 'axios';
import type { Event } from '../media/type';

export function getEvents(): AxiosPromise<Event[]> {
  return axios.get('/event');
}

export function getEvent(id: number): AxiosPromise<Event> {
  return axios.get(`/event/${id}`);
}

export function updateEvent(id: number, data, authorId: number): AxiosPromise<void> {
  const form = new FormData();
  form.append('event', JSON.stringify({
    title: data.title,
    location: data.location,
    date: data.date,
    description: data.description,
    clubId: authorId,
  }));
  form.append('image', data.image);
  return axios.put(`/event/${id}`, form);
}


export function deleteEvent(id: number): AxiosPromise<void> {
  return axios.delete(`/event/${id}`);
}