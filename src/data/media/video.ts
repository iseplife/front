import axios from 'axios';
import { VideoEmbed } from './type';

export function createVideoEmbed(form: VideoEmbed) {
  return axios.post('/media/videoEmbed', form);
}

export function createVideo(postId: number, form: any, onUploadProgress: any) {
  var data = new FormData();
  data.append('post', String(postId));
  data.append('video', form.video);
  data.append('name', form.name);
  return axios.post('/media/video', data, { onUploadProgress });
}
