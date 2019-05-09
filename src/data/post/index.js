// @flow

import axios from 'axios';
import type { AxiosPromise } from 'axios';

import type { Author, Student } from '../users/type';
import type { Post, Comment, PostCreation } from './type';
import type { Page } from '../request.type';

export function getPosts(page: number): AxiosPromise<Page<Post>> {
  return axios.get(`/post?page=${page}`);
}

export function getPinnedPosts(): AxiosPromise<Post[]> {
  return axios.get('/post/pinned');
}

export function getPost(id: number): AxiosPromise<Post> {
  return axios.get(`/post/${id}`);
}

export function getWaitingPost(): AxiosPromise<Post[]> {
  return axios.get('/post/waiting');
}

export function updatePost(id: number, form): AxiosPromise<Post> {
  return axios.put(`/post/${id}`, form);
}

export function getComments(postId: number): AxiosPromise<Comment[]> {
  return axios.get(`/post/${postId}/comment`);
}

export function comment(
  postId: number,
  message: string
): AxiosPromise<Comment> {
  return axios.put(`/post/${postId}/comment`, { message });
}

export function deleteComment(
  postId: number,
  commId: number
): AxiosPromise<void> {
  return axios.delete(`/post/${postId}/comment/${commId}`);
}

export function toggleLikeComment(
  postId: number,
  comId: number
): AxiosPromise<void> {
  return axios.put(`/post/${postId}/comment/${comId}/like`);
}

export function deletePost(id: number): AxiosPromise<void> {
  return axios.delete(`/post/${id}`);
}

export function createPost(post: PostCreation): AxiosPromise<Post> {
  return axios.post('/post', post);
}

export function pinPost(id: number, state: boolean): AxiosPromise<void> {
  return axios.put(`/post/${id}/pinned/${state ? 'true' : 'false'}`);
}

export function publishPost(id: number): AxiosPromise<void> {
  return axios.put(`/post/${id}/state/PUBLISHED`);
}

export function getAuthors(): AxiosPromise<Author[]> {
  return axios.get('/post/authors');
}

export function addMedia(id: number, mediaId: number): AxiosPromise<void> {
  return axios.put(`/post/${id}/embed/${mediaId}`);
}

export function toggleLikePost(id: number): AxiosPromise<void> {
  return axios.put(`/post/${id}/like`);
}

export function getLikes(type: string, id: number): AxiosPromise<Student[]> {
  if (type === 'post') {
    return axios.get(`/post/${id}/likes`);
  }
  if (type === 'comment') {
    return axios.get(`/post/comment/${id}/likes`);
  }
  return Promise.reject();
}
