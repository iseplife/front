import axios, { AxiosPromise } from 'axios';
import { Image, Gallery, Match } from './type';

export function createImage(
  postId: number,
  file: File,
  onUploadProgress: any
): AxiosPromise<Image> {
  var data = new FormData();
  data.append('post', String(postId));
  data.append('image', file);
  return axios.post('/media/image', data, { onUploadProgress });
}

export function createGallery(
  postId: number,
  form: any,
  onUploadProgress: any
): AxiosPromise<Gallery> {
  var data = new FormData();
  data.append('post', String(postId));
  data.append('name', form.title);
  for (var i = 0; i < form.images.length; i++) {
    data.append('images[]', form.images[i]);
  }
  return axios.post('/media/gallery', data, { onUploadProgress });
}

export function getGallery(id: number): AxiosPromise<Gallery> {
  return axios.get(`/media/gallery/${id}`);
}

export function getGalleryImages(id: number): AxiosPromise<Image[]> {
  return axios.get(`/media/gallery/${id}/images`);
}

export function matchStudent(
  photoId: number,
  studId: number
): AxiosPromise<void> {
  return axios.put(`/media/image/${photoId}/match/${studId}/tag`);
}

export function unmatchStudent(
  photoId: number,
  studId: number
): AxiosPromise<void> {
  return axios.put(`/media/image/${photoId}/match/${studId}/untag`);
}

export function getImageTags(id: number): AxiosPromise<Match[]> {
  return axios.get(`/media/image/${id}/tags`);
}

export function deleteImages(
  galleryId: number,
  imageids: number[]
): AxiosPromise<void> {
  return axios.put(`/media/gallery/${galleryId}/images/remove`, imageids);
}

export function addImages(
  galleryId: number,
  images: FileList
): AxiosPromise<void> {
  const form = new FormData();
  for (var i = 0; i < images.length; i++) {
    form.append('images[]', images[i]);
  }
  return axios.put(`/media/gallery/${galleryId}/images`, form);
}
