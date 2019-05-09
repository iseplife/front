// @flow

import axios from 'axios';
import type { VideoEmbed, Video } from './type';

export function createVideoEmbed(form: VideoEmbed) {
  return axios.post('/media/videoEmbed', form);
}

export function createVideo(postId: number, form: Video, onUploadProgress) {
  var data = new FormData();
  data.append('post', String(postId));
  data.append('video', form.video);
  data.append('name', form.name);
  return axios.post('/media/video', data, { onUploadProgress });
}
